import Bid from "../models/bid.model.js";
import Product from "../models/product.model.js";
export const createBid = async (req, res) => {
  const { product_id, bidder_id, price } = req.body;

  const product = await Product.findById(product_id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  //if (product.status !== "active") return res.status(400).json({ error: "Phiên đấu giá không còn hiệu lực" });

  if (price < product.current_price + (product.bid_step || 0))
    return res.status(400).json({ message: "Bid too low" });

  const bid = new Bid({ product_id, bidder_id, price });
  await bid.save();

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

export const getAllBids = async (req, res) => {
  const bids = await Bid.find().populate("product_id bidder_id");
  res.json(bids);
};

export const updateBid = async (req, res) => {
  const { price } = req.body;
  const bid = await Bid.findById(req.params.id);
  if (!bid) return res.status(404).json({ message: "Bid not found" });

  bid.price = price;
  await bid.save();
  res.json(bid);
};

export const deleteBid = async (req, res) => {
  const bid = await Bid.findByIdAndDelete(req.params.id);
  if (!bid) return res.status(404).json({ message: "Bid not found" });
  res.json({ message: "Bid deleted" });
};
