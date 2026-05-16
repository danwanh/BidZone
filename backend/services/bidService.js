import Bid from "../models/bidModel.js";
import Product from "../models/productModel.js";
import appEvent from "./mailSystem/mailEvents.js";
import AutoBid from "../models/autobidModel.js";
import User from "../models/userModel.js";
import SystemConfig from "../models/systemConfigModel.js";
import mongoose from "mongoose";

export const getBidById = async (id) => {
  const bid = await Product.findById(id).populate("bidder_id");
  if (!bid) throw new Error("No bid found");
  return bid;
};

export const createBid = async (bidData) => {
  const { product_id, bidder_id, price } = bidData;

  const product = await Product.findById(product_id);
  if (!product) throw new Error("Product not found");

  if (product.status !== "active") throw new Error("Phiên đấu giá không còn hiệu lực");

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

  const minPrice = product.current_price + (product.bid_step || 0);
  if (price < minPrice) {
    throw new Error(`Giá đấu tối thiểu là ${minPrice}`);
  }

  const bid = new Bid({ product_id, bidder_id, price });
  await bid.save();

  let prevBidder = null;
  if (product.bidder_id) {
    prevBidder = await User.findById(product.bidder_id);
  }

  const config = await SystemConfig.findOne().sort({ createdAt: -1 });
  if (config && product.end_time) {
    const now = new Date();
    const diffMinutes = (new Date(product.end_time).getTime() - now.getTime()) / 60000;
    if (diffMinutes <= Number(config.value)) {
      product.end_time = new Date(new Date(product.end_time).getTime() + Number(config.extend) * 60000);
    }
  }

  product.current_price = price;
  product.bidder_id = bidder_id;
  product.total_bids = (product.total_bids || 0) + 1;
  await product.save();

  const seller = await User.findById(product.seller_id);
  appEvent.emit("BID_SUCCESS", { product, bidder, seller, prevBidder });

  return bid;
};

export const getBidsByProduct = async (product_id) => {
  return await Bid.find({ product_id }).populate("bidder_id", "name email rating_pos rating_neg");
};

export const getBidByUser = async (userId, queryParams) => {
  const { page = 1, per_page = 6, q = "" } = queryParams;
  const products = await Bid.find({ bidder_id: userId }).populate("product_id bidder_id", "rating_pos rating_neg name");
  
  const page_num = Math.max(1, Number(page) || 1);
  const per_page_num = Math.max(1, Number(per_page) || 6);
  const filtered = products.filter((p) =>
    p.product_id?.name?.toLowerCase().includes(q.toLowerCase())
  );

  const result = filtered.slice((page_num - 1) * per_page_num, (page_num - 1) * per_page_num + per_page_num);
  return {
    products: result,
    total_page: Math.ceil(filtered.length / per_page_num),
  };
};

export const getBiddingByUser = async (userId, queryParams) => {
  const { page = 1, per_page = 6, q = "" } = queryParams;
  const pageNum = Math.max(1, Number(page));
  const perPageNum = Math.max(1, Number(per_page));
  const uId = new mongoose.Types.ObjectId(userId);

  const pipeline = [
    { $match: { bidder_id: uId } },
    {
      $unionWith: {
        coll: "autobids",
        pipeline: [{ $match: { bidder_id: uId } }],
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "product_id",
        foreignField: "_id",
        as: "product_id",
      },
    },
    { $unwind: "$product_id" },
    {
      $lookup: {
        from: "categories",
        localField: "product_id.category_id",
        foreignField: "_id",
        as: "product_id.category_id",
      },
    },
    { $unwind: { path: "$product_id.category_id", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "product_id.seller_id",
        foreignField: "_id",
        as: "product_id.seller_id",
      },
    },
    { $unwind: { path: "$product_id.seller_id", preserveNullAndEmptyArrays: true } },
    {
      $match: {
        "product_id.status": { $ne: "ended" },
        "product_id.name": { $regex: q, $options: "i" },
      },
    },
    {
      $group: {
        _id: "$product_id._id",
        product_id: { $first: "$product_id" },
        bidder_id: { $first: "$bidder_id" },
        price: { $max: "$price" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "product_id.bidder_id",
        foreignField: "_id",
        as: "product_id.bidder_id",
      },
    },
    { $unwind: "$product_id.bidder_id" },
    {
      $facet: {
        products: [{ $skip: (pageNum - 1) * perPageNum }, { $limit: perPageNum }],
        total: [{ $count: "count" }],
      },
    },
  ];

  const aggResult = await Bid.aggregate(pipeline);
  return {
    products: aggResult[0]?.products || [],
    total_page: Math.ceil((aggResult[0]?.total[0]?.count || 0) / perPageNum),
  };
};

export const getAllBids = async () => {
  return await Bid.find().populate("product_id bidder_id");
};

export const updateBidStatus = async (id, status) => {
  const bid = await Bid.findById(id);
  if (!bid) throw new Error("Bid not found");
  bid.status = status;
  return await bid.save();
};

export const deleteBid = async (id) => {
  const bid = await Bid.findByIdAndDelete(id);
  if (!bid) throw new Error("Bid not found");
  return bid;
};

export const rejectBid = async (id) => {
  const bid = await Bid.findById(id);
  if (!bid) throw new Error("Bid không tồn tại");

  await Bid.updateMany(
    { product_id: bid.product_id, bidder_id: bid.bidder_id },
    { status: false }
  );

  const highestValidBid = await Bid.findOne({
    product_id: bid.product_id,
    status: true,
  }).sort({ price: -1 });

  let product = await Product.findById(bid.product_id);
  const newPrice = highestValidBid ? highestValidBid.price : product.start_price;
  product.current_price = newPrice;
  await product.save();

  appEvent.emit("BID_REJECTED", {
    bidder: await User.findById(bid.bidder_id),
    product,
    reason: "Tất cả lượt ra giá của bạn đã bị từ chối bởi người bán",
  });

  return { newPrice };
};
