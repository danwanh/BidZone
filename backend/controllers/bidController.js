import Bid from "../models/bid.model.js";
import Product from "../models/product.model.js";
import appEvent from "../utils/eventEmiiter.js";

export const getBidById = async (req, res) => {
  try {
    const { id: bid_id } = req.params;

    const bid = await Product.findById(bid_id);

    if (!bid) return res.status(400).json({ message: "No bid found" });
    else return res.status(200).json(bid);
  } catch (error) {
    console.error("Error getting bid: ", error);
    res.status(500).json({ message: "Can't get bid" });
  }
};

export const createBid = async (req, res) => {
  const { product_id, bidder_id, price } = req.body;

  const product = await Product.findById(product_id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  if (product.status !== "active") return res.status(400).json({ error: "Phiên đấu giá không còn hiệu lực" });

  if (price < product.current_price + (product.bid_step || 0))
    return res.status(400).json({ message: "Bid too low" });

  const bid = new Bid({ product_id, bidder_id, price });
  await bid.save();

  appEvent.emit("BID_SUCCESS", {
    product,
    bidder,
    seller,
    prevBidder,
  });

  // update product
  product.current_price = price;
  product.highest_bidder_id = bidder_id;
  product.total_bids = (product.total_bids || 0) + 1;
  await product.save();

  res.status(201).json(bid);
};

export const getBidsByProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
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
    const { id } = req.params;
    const products = await Bid.find({ bidder_id: id }).populate(
      "product_id bidder_id"
    );
    const { page = 1, per_page = 6, q = "" } = req.query;
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
    const { id } = req.params;
    const products = await Bid.find({
      bidder_id: id,
    }).populate("product_id bidder_id");

    if (products.length === 0) {
      return [];
    }
    const active = products.filter((p) => p?.product_id?.status !== "ended");

    const { page = 1, per_page = 6, q = "" } = req.query;
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
  const { status } = req.body;
  const bid = await Bid.findById(req.params.id);
  if (!bid) return res.status(404).json({ message: "Bid not found" });

  bid.status = status;
  await bid.save();
  res.json(bid);
};

export const deleteBid = async (req, res) => {
  const bid = await Bid.findByIdAndDelete(req.params.id);
  if (!bid) return res.status(404).json({ message: "Bid not found" });
  res.json({ message: "Bid deleted" });
};

export const rejectBid = async (req, res) => {
  try {
    const { id } = req.params;

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
