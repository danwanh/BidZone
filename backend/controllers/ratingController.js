import Rating from "../models/rating.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find();
    res.json(ratings);
  } catch (err) {
    console.error("Error getting all ratings:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getRatingByID = async (req, res) => {
  await getRating(req, res);
  if (!res.rating) return res;
  res.json(res.rating);
};

export const createRating = async (req, res) => {
  try {
    const { product_id, from_user_id, to_user_id, comment, points } =
      req.validated.body;

    // // Validate
    // if (!product_id || !from_user_id || !to_user_id || points === undefined) {
    //   return res.status(400).json({ message: "Missing required fields" });
    // }

    // if (![1, -1].includes(points)) {
    //   return res.status(400).json({ message: "Points must be 1 or -1" });
    // }

    if (from_user_id === to_user_id) {
      return res.status(400).json({ message: "User can't rate themself" });
    }

    // Check tồn tại
    const product = await Product.findById(product_id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const rater = await User.findById(from_user_id);
    if (!rater) return res.status(404).json({ message: "Rater not found" });

    const rated = await User.findById(to_user_id);
    if (!rated)
      return res.status(404).json({ message: "Rated user not found" });

    // Check đã rate chưa (1 đơn hàng chỉ 1 lần)
    const existed = await Rating.findOne({
      product_id,
      from_user_id,
      to_user_id,
    });
    if (existed) {
      return res
        .status(400)
        .json({ message: "Bạn đã rate người bán này với sản phẩm này rồi" });
    }

    const rating = await Rating.create({
      product_id,
      from_user_id,
      to_user_id,
      points,
      comment,
    });

    // Update điểm user
    await User.findByIdAndUpdate(to_user_id, {
      $inc: points === 1 ? { rating_pos: 1 } : { rating_neg: 1 },
    });

    res.status(201).json(rating);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const updateRating = async (req, res) => {
  const { product_id, from_user_id, to_user_id, comment, points } =
    req.validated.body;
  try {
    await getRating(req, res);
    if (!res.rating) return res;

    if (from_user_id === to_user_id) {
      return res.status(400).json({ message: "User can't rate themself " });
    } else if (points !== 1 && points !== -1) {
      return res.status(400).json({ message: "Points must be either 1 or -1" });
    }

    //Check for existence
    const product = await Product.findById(product_id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const rater = await User.findById(from_user_id);
    if (!rater) return res.status(404).json({ message: "Rater not found" });

    const rated = await User.findById(to_user_id);
    if (!rated)
      return res
        .status(404)
        .json({ message: "Target user for rating not found" });

    if (product_id) res.rating.product_id = product_id;
    if (from_user_id) res.rating.from_user_id = from_user_id;
    if (to_user_id) res.rating.to_user_id = to_user_id;
    if (comment) res.rating.comment = comment;
    if (points) res.rating.points = points;
    const updated = await Rating.findByIdAndUpdate(
      req.validated.params.id,
      res.rating,
      {
        new: true,
      }
    );

    res.json(updated);
  } catch (err) {
    console.error("Error updating rating:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteRating = async (req, res) => {
  try {
    await getRating(req, res);
    if (!res.rating) return res;

    const deleted = await Rating.findByIdAndDelete(req.validated.params.id);
    if (!deleted)
      return res.status(500).json({ message: "Failed to delete rating" });

    res.json({ message: "Deleted rating" });
  } catch (err) {
    console.error("Error deleting rating:", err);
    res.status(500).json({ message: err.message });
  }
};

async function getRating(req, res) {
  let rating;
  try {
    // if (!mongoose.Types.ObjectId.isValid(req.validated.params.id)) {
    //   return res.status(400).json({ message: "Invalid ObjectId format" });
    // }

    rating = await Rating.findById(req.validated.params.id);
    if (!rating) {
      return res.status(500).json({ message: "Can't find rating" });
    }
  } catch (err) {
    console.error("Error getting rating by ID:", err);
    return res.status(500).json({ message: err.message });
  }
  res.rating = rating;
}

async function is_valid_req(req) {
  //Check for validation
  // if (!product_id || !from_user_id || !to_user_id || !comment) {
  //   return res.status(400).json({ message: "Missing required fields" });
  // } else if (points !== 1 && points !== -1) {
  //   return res.status(400).json({ message: "Points must be either 1 or -1" });
  // } else
  if (from_user_id === to_user_id) {
    return res.status(400).json({ message: "User can't rate themself " });
  }

  //Check for existence
  const product = await Product.exists(product_id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const rater = User.findById(from_user_id);
  if (!rater) return res.status(404).json({ message: "Rater not found" });

  const rated = User.findById(to_user_id);
  if (!rated)
    return res
      .status(404)
      .json({ message: "Target user for rating not found" });
}

export const getRatingsByUser = async (req, res) => {
  try {
    const ratings = await Rating.find({
      to_user_id: req.validated.params.userId,
    })
      .populate("from_user_id")
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
