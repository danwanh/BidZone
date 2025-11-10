import Bid from "../models/bid.model.js";
import Product from "../models/product.model.js"
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
    const bids = await Bid.find({ product_id }).populate("bidder_id", "name email");
    res.json(bids);
  } catch (err) {
    console.error("Error fetching bids:", err);
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