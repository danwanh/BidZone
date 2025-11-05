import Bid from "../models/bid.model.js";

// [POST] /api/bids
export const createBid = async (req, res) => {
  try {
    const { product_id, bidder_id, price } = req.body;

    if (!product_id || !bidder_id || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newBid = new Bid({ product_id, bidder_id, price });
    const savedBid = await newBid.save();

    res.status(201).json(savedBid);
  } catch (err) {
    console.error("Error creating bid:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// [GET] /api/bids/:product_id 
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
