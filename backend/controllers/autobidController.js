import AutoBid from "../models/autobid.model.js";
import Product from "../models/product.model.js";
import appEvent from "../services/mailSystem/mailEvents.js";
import User from "../models/user.model.js";

import SystemConfig from "../models/system_config.model.js";
export const createAutoBid = async (req, res) => {
  try {
    const { product_id, bidder_id, max_price } = req.validated.body;

    const product = await Product.findById(product_id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (product.status !== "active")
      return res.status(400).json({ error: "Autobid out of date" });

    if (product.is_autobid !== true)
      return res.status(400).json({ error: "Product is not auto-bidded" });

    // check banned bidders
    if (
      product.banned_bidders?.some(
        (id) => id.toString() === bidder_id.toString()
      )
    ) {
      return res.status(403).json({
        error: "Bạn đã bị người bán chặn tham gia đấu giá sản phẩm này",
      });
    }

    const bidder = await User.findById(bidder_id);
    if (!bidder) return res.status(404).json({ error: "Bidder not found" });

    // check bidder rating
    const pos = bidder.rating_pos || 0;
    const neg = bidder.rating_neg || 0;
    const total = pos + neg;

    if (total === 0 && !product.allow_unrated_bidders) {
      return res.status(403).json({
        error:
          "Người bán không cho phép người chưa có đánh giá tham gia đấu giá",
      });
    }

    if (total > 0 && pos / total < 0.8) {
      return res.status(403).json({
        error: "Điểm uy tín của bạn chưa đạt 80%",
      });
    }

    const bidStep = product.bid_step || 0;

    // check max_price
    let userBid = await AutoBid.findOne({ product_id, bidder_id });

    if (userBid) {
      if (userBid.max_price >= max_price)
        return res.status(400).json({ error: "Max price need to be larger" });

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

    // calculate new current price and holder: nếu là bidder cũ thì update max_price, bidder mới thì tạo autobid
    const allBids = await AutoBid.find({ product_id }).sort({
      max_price: -1,
      createdAt: 1,
    });

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

    // extend auction time if needed
    const config = await SystemConfig.findOne().sort({
      createdAt: -1,
    });

    if (config && product.end_time) {
      const now = new Date();
      const diffMinutes =
        (new Date(product.end_time).getTime() - now.getTime()) / 60000;

      if (diffMinutes <= Number(config.value)) {
        product.end_time = new Date(
          new Date(product.end_time).getTime() + Number(config.extend) * 60000
        );
      }
    }

    // update product
    product.current_price = newPrice;
    product.bidder_id = newHolder;

    product.total_bids += 1;

    await product.save();

    let prevBidder;
    if (secondBid) {
      prevBidder = await User.findById(secondBid.bidder_id);
    }

    const seller = await User.findById(product.seller_id);

    appEvent.emit("BID_SUCCESS", {
      product,
      bidder,
      seller,
      prevBidder,
    });

    res.status(200).json({
      message: "Success",
      data: {
        product_id,
        current_price: newPrice,
        current_holder: newHolder,
        total_bidders: allBids.length,
      },
    });
  } catch (err) {
    console.error("Create autobid error:", err);
    res.status(500).json({ error: "Error while creating autobid" });
  }
};

export const getAutoBidsByProduct = async (req, res) => {
  try {
    const { product_id } = req.validated.params;
    const bids = await AutoBid.find({ product_id }).populate(
      "bidder_id current_holder",
      "name"
    );
    res.json(bids);
  } catch (err) {
    console.error("Error fetching bids:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllAutoBids = async (req, res) => {
  const bids = await AutoBid.find().populate("product_id bidder_id");
  res.json(bids);
};

export const deleteAutoBid = async (req, res) => {
  const bid = await AutoBid.findByIdAndDelete(req.validated.params.id);
  if (!bid) return res.status(404).json({ message: "AutoBid not found" });
  res.json({ message: "AutoBid deleted" });
};

export const getAutoBidById = async (req, res) => {
  try {
    const { id: bid_id } = req.validated.params;

    const bid = await Product.findById(bid_id);

    if (!bid) return res.status(400).json({ message: "No bid found" });
    else return res.status(200).json(bid);
  } catch (error) {
    console.error("Error getting bid: ", error);
    res.status(500).json({ message: "Can't get bid" });
  }
};

export const updateBidStatus = async (req, res) => {
  const { status } = req.validated.body;
  const bid = await Bid.findById(req.params.id);
  if (!bid) return res.status(404).json({ message: "Bid not found" });

  bid.status = status;
  await bid.save();
  res.json(bid);
};

export const rejectAutoBid = async (req, res) => {
  try {
    const { id } = req.validated.params;

    const bid = await AutoBid.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );

    if (!bid) {
      return res.status(404).json({ message: "Bid không tồn tại" });
    }

    const highestValidBid = await AutoBid.findOne({
      product_id: bid.product_id,
      status: true,
    }).sort({ price: -1 });

    const newPrice = highestValidBid ? highestValidBid.price : 0;

    const product = await Product.findByIdAndUpdate(bid.product_id, {
      currentPrice: newPrice,
    });

    appEvent.emit("BID_REJECTED", {
      bidder: await User.findById(bid.bidder_id),
      product,
      reason: "Lượt ra giá của bạn đã bị từ chối bời người bán",
    });

    res.json({
      message: "Đã từ chối bid & cập nhật giá",
      currentPrice: newPrice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
