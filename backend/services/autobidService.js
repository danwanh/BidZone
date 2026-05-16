import AutoBid from "../models/autobidModel.js";
import Product from "../models/productModel.js";
import appEvent from "./mailSystem/mailEvents.js";
import User from "../models/userModel.js";
import SystemConfig from "../models/systemConfigModel.js";

export const createAutoBid = async (bidData) => {
  const { product_id, bidder_id, max_price } = bidData;

  const product = await Product.findById(product_id);
  if (!product) throw new Error("Product not found");
  if (product.status !== "active") throw new Error("Autobid out of date");
  if (product.is_autobid !== true) throw new Error("Product is not auto-bidded");

  if (product.banned_bidders?.some((id) => id.toString() === bidder_id.toString())) {
    throw new Error("Bạn đã bị người bán chặn tham gia đấu giá sản phẩm này");
  }

  const bidder = await User.findById(bidder_id);
  if (!bidder) throw new Error("Bidder not found");

  const pos = bidder.rating_pos || 0;
  const neg = bidder.rating_neg || 0;
  const total = pos + neg;

  if (total === 0 && !product.allow_unrated_bidders) {
    throw new Error("Người bán không cho phép người chưa có đánh giá tham gia đấu giá");
  }
  if (total > 0 && pos / total < 0.8) {
    throw new Error("Điểm uy tín của bạn chưa đạt 80%");
  }

  const bidStep = product.bid_step || 0;
  let userBid = await AutoBid.findOne({ product_id, bidder_id });

  if (userBid) {
    if (userBid.max_price >= max_price) throw new Error("Max price need to be larger");
    userBid.max_price = max_price;
    await userBid.save();
  } else {
    const startPrice = product.current_price || product.start_price;
    userBid = await AutoBid.create({
      product_id,
      bidder_id,
      price: startPrice,
      max_price,
      current_holder: bidder_id,
    });
  }

  const allBids = await AutoBid.find({ product_id, status: true }).sort({ max_price: -1, createdAt: 1 });
  const topBid = allBids[0];
  const secondBid = allBids[1];

  let newPrice = product.current_price || product.start_price;
  let newHolder = topBid.bidder_id;

  if (!secondBid) {
    newPrice = product.start_price;
  } else {
    newPrice = Math.min(topBid.max_price, secondBid.max_price + bidStep);
    newHolder = topBid.bidder_id;
  }

  userBid.current_holder = newHolder;
  userBid.price = newPrice;
  await userBid.save();

  const config = await SystemConfig.findOne().sort({ createdAt: -1 });
  if (config && product.end_time) {
    const now = new Date();
    const diffMinutes = (new Date(product.end_time).getTime() - now.getTime()) / 60000;
    if (diffMinutes <= Number(config.value)) {
      product.end_time = new Date(new Date(product.end_time).getTime() + Number(config.extend) * 60000);
    }
  }

  product.current_price = newPrice;
  product.bidder_id = newHolder;
  product.total_bids += 1;
  await product.save();

  let prevBidder;
  if (secondBid) {
    prevBidder = await User.findById(secondBid.bidder_id);
  }

  const seller = await User.findById(product.seller_id);
  appEvent.emit("BID_SUCCESS", { product, bidder, seller, prevBidder });

  return {
    product_id,
    current_price: newPrice,
    current_holder: newHolder,
    total_bidders: allBids.length,
  };
};

export const getAutoBidsByProduct = async (product_id) => {
  return await AutoBid.find({ product_id }).populate("bidder_id current_holder", "name email rating_pos rating_neg");
};

export const getAllAutoBids = async () => {
  return await AutoBid.find().populate("product_id bidder_id");
};

export const deleteAutoBid = async (id) => {
  const bid = await AutoBid.findByIdAndDelete(id);
  if (!bid) throw new Error("AutoBid not found");
  return bid;
};

export const getAutoBidById = async (id) => {
  const bid = await AutoBid.findById(id);
  if (!bid) throw new Error("No bid found");
  return bid;
};

export const updateBidStatus = async (id, status) => {
  const bid = await AutoBid.findByIdAndUpdate(id, { status }, { new: true });
  if (!bid) throw new Error("AutoBid not found");
  return bid;
};

export const rejectAutoBid = async (id) => {
  const bid = await AutoBid.findById(id);
  if (!bid) throw new Error("Bid không tồn tại");

  await AutoBid.updateMany(
    { product_id: bid.product_id, bidder_id: bid.bidder_id },
    { status: false }
  );

  const highestValidBid = await AutoBid.findOne({ product_id: bid.product_id, status: true }).sort({ price: -1 });
  const newPrice = highestValidBid ? highestValidBid.price : 0;

  const product = await Product.findByIdAndUpdate(bid.product_id, { currentPrice: newPrice }, { new: true });

  appEvent.emit("BID_REJECTED", {
    bidder: await User.findById(bid.bidder_id),
    product,
    reason: "Tất cả lượt ra giá của bạn đã bị từ chối bởi người bán",
  });

  return { newPrice };
};
