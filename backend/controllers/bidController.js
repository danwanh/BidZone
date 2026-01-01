import Bid from "../models/bid.model.js";
import Product from "../models/product.model.js";
import appEvent from "../services/mailSystem/mailEvents.js";
import User from "../models/user.model.js";
import SystemConfig from "../models/system_config.model.js";

export const getBidById = async (req, res) => {
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

// export const createBid = async (req, res) => {
//   const { product_id, bidder_id, price } = req.validated.body;

//   const product = await Product.findById(product_id);
//   if (!product) return res.status(404).json({ message: "Product not found" });
//   if (product.status !== "active")
//     return res.status(400).json({ error: "Phiên đấu giá không còn hiệu lực" });

//   if (price < product.current_price + (product.bid_step || 0))
//     return res.status(400).json({ message: "Bid too low" });

//   const bid = new Bid({ product_id, bidder_id, price });
//   await bid.save();

//   let prevBidder = null;
//   if (product.bidder_id) prevBidder = await User.findById(product.bidder_id);

//   // update product
//   product.current_price = price;
//   product.highest_bidder_id = bidder_id;
//   product.total_bids = (product.total_bids || 0) + 1;
//   await product.save();

//   const bidder = await User.findById(bidder_id);
//   const seller = await User.findById(product.seller_id);
//   appEvent.emit("BID_SUCCESS", {
//     product,
//     bidder,
//     seller,
//     prevBidder,
//   });

//   res.status(201).json(bid);
// };
export const createBid = async (req, res) => {
  try {
    const { product_id, bidder_id, price } = req.validated.body;

    const product = await Product.findById(product_id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    if (product.status !== "active")
      return res
        .status(400)
        .json({ message: "Phiên đấu giá không còn hiệu lực" });

    // check if bidder is banned
    if (
      product.banned_bidders?.some(
        (id) => id.toString() === bidder_id.toString()
      )
    ) {
      return res.status(403).json({
        message: "Bạn đã bị người bán chặn tham gia đấu giá sản phẩm này",
      });
    }

    const bidder = await User.findById(bidder_id);
    if (!bidder)
      return res.status(404).json({ message: "Bidder not found" });

    // check bidder rating
    const pos = bidder.rating_pos || 0;
    const neg = bidder.rating_neg || 0;
    const total = pos + neg;

    if (total === 0 && !product.allow_unrated_bidders) {
      return res.status(403).json({
        message:
          "Người bán không cho phép người chưa có đánh giá tham gia đấu giá",
      });
    }

    if (total > 0 && pos / total < 0.8) {
      return res.status(403).json({
        message: "Điểm uy tín của bạn chưa đạt 80%",
      });
    }

    //check min price
    const minPrice =
      product.current_price + (product.bid_step || 0);

    if (price < minPrice) {
      return res.status(400).json({
        message: `Giá đấu tối thiểu là ${minPrice}`,
      });
    }

    // create bid
    const bid = new Bid({ product_id, bidder_id, price });
    await bid.save();

    let prevBidder = null;
    if (product.highest_bidder_id) {
      prevBidder = await User.findById(product.highest_bidder_id);
    }

    // extend auction time if needed
    const config = await SystemConfig.findOne()
      .sort({ createdAt: -1 });

    if (config && product.end_time) {
      const now = new Date();
      const diffMinutes =
        (new Date(product.end_time).getTime() - now.getTime()) / 60000;

      if (diffMinutes >= Number(config.value)) {
        product.end_time = new Date(
          new Date(product.end_time).getTime() +
            Number(config.extend) * 60000
        );
      }
    }

  // update product
  product.current_price = price;
  product.bidder_id = bidder_id;
  product.total_bids = (product.total_bids || 0) + 1;
  await product.save();

    const seller = await User.findById(product.seller_id);

    appEvent.emit("BID_SUCCESS", {
      product,
      bidder,
      seller,
      prevBidder,
    });

    res.status(201).json(bid);
  } catch (error) {
    console.error("Create bid error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getBidsByProduct = async (req, res) => {
  try {
    const { product_id } = req.validated.params;
    const bids = await Bid.find({ product_id }).populate(
      "bidder_id",
      "name email"
    );
    res.json(bids);
  } catch (err) {
    console.error("Error fetching bids:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// /api/bid/user/:id
export const getBidByUser = async (req, res) => {
  try {
    const { id } = req.validated.params;
    const products = await Bid.find({ bidder_id: id }).populate(
      "product_id bidder_id"
    );
    const { page = 1, per_page = 6, q = "" } = req.validated.query;
    const page_num = Math.max(1, Number(page) || 1);
    const per_page_num = Math.max(1, Number(per_page) || 6);
    const filtered = products.filter((p) =>
      p.product_id?.name?.toLowerCase().includes(q.toLowerCase())
    );

    const result = filtered.slice(
      (page_num - 1) * per_page_num,
      (page_num - 1) * per_page_num + per_page_num
    );
    const total_page = Math.ceil(filtered.length / per_page_num);
    res.status(200).json({
      message: "Got bids by user id successfully!",
      products: result,
      total_page: total_page,
    });
  } catch (err) {
    console.log("error fetching bids:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// /api/bid/user/bidding/:id
export const getBiddingByUser = async (req, res) => {
  try {
    const { id } = req.validated.params;
    const products = await Bid.find({
      bidder_id: id,
    }).populate("product_id bidder_id");

    if (products.length === 0) {
      return [];
    }
    const active = products.filter((p) => p?.product_id?.status !== "ended");

    const { page = 1, per_page = 6, q = "" } = req.validated.query;
    const page_num = Math.max(1, Number(page) || 1);
    const per_page_num = Math.max(1, Number(per_page) || 6);
    const filtered = active.filter((p) =>
      p.product_id?.name?.toLowerCase().includes(q.toLowerCase())
    );

    const result = filtered.slice(
      (page_num - 1) * per_page_num,
      (page_num - 1) * per_page_num + per_page_num
    );
    const total_page = Math.ceil(filtered.length / per_page_num);
    res.status(200).json({
      message: "Got bids by user id successfully!",
      products: result,
      total_page: total_page,
    });
  } catch (err) {
    console.log("error fetching bids:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllBids = async (req, res) => {
  const bids = await Bid.find().populate("product_id bidder_id");
  res.json(bids);
};

export const updateBidStatus = async (req, res) => {
  const { status } = req.validated.body;
  const bid = await Bid.findById(req.validated.params.id);
  if (!bid) return res.status(404).json({ message: "Bid not found" });

  bid.status = status;
  await bid.save();
  res.json(bid);
};

export const deleteBid = async (req, res) => {
  const bid = await Bid.findByIdAndDelete(req.validated.params.id);
  if (!bid) return res.status(404).json({ message: "Bid not found" });
  res.json({ message: "Bid deleted" });
};

export const rejectBid = async (req, res) => {
  try {
    const { id } = req.validated.params;

    const bid = await Bid.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );

    if (!bid) {
      return res.status(404).json({ message: "Bid không tồn tại" });
    }

    const highestValidBid = await Bid.findOne({
      product_id: bid.product_id,
      status: true,
    }).sort({ price: -1 });

    const newPrice = highestValidBid ? highestValidBid.price : 0;

    await Product.findByIdAndUpdate(bid.product_id, {
      current_price: newPrice,
    });

    appEvent.emit("BID_REJECTED", {
      bidder,
      product,
      reason: "Lượt ra giá của bạn đã bị từ chối bời người bán",
    });

    res.json({
      message: "Đã từ chối bid & cập nhật giá",
      current_price: newPrice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
