import Rating from "../models/ratingModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

export const getAllRatings = async (queryParams) => {
  const { product_id, from_user_id, to_user_id } = queryParams;
  const query = {};
  if (product_id) query.product_id = product_id;
  if (from_user_id) query.from_user_id = from_user_id;
  if (to_user_id) query.to_user_id = to_user_id;

  const ratings = await Rating.find(query).populate("product_id from_user_id to_user_id");
  if (ratings.length === 0) throw new Error("Không tìm thấy đánh giá");
  return ratings;
};

export const getRatingById = async (id) => {
  const rating = await Rating.findById(id);
  if (!rating) throw new Error("Can't find rating");
  return rating;
};

export const createRating = async (ratingData) => {
  const { product_id, from_user_id, to_user_id, comment, points } = ratingData;

  if (from_user_id === to_user_id) throw new Error("User can't rate themself");

  const product = await Product.findById(product_id);
  if (!product) throw new Error("Product not found");

  const rater = await User.findById(from_user_id);
  if (!rater) throw new Error("Rater not found");

  const rated = await User.findById(to_user_id);
  if (!rated) throw new Error("Rated user not found");

  const existed = await Rating.findOne({ product_id, from_user_id, to_user_id });
  if (existed) throw new Error("Bạn đã rate người bán này với sản phẩm này rồi");

  const rating = await Rating.create({ product_id, from_user_id, to_user_id, points, comment });

  await User.findByIdAndUpdate(to_user_id, {
    $inc: points === 1 ? { rating_pos: 1 } : { rating_neg: 1 },
  });

  return rating;
};

export const updateRating = async (id, updateData) => {
  const { product_id, from_user_id, to_user_id, comment, points } = updateData;

  const rating = await Rating.findById(id);
  if (!rating) throw new Error("Can't find rating");

  if (from_user_id && to_user_id && from_user_id === to_user_id) throw new Error("User can't rate themself");
  if (points !== undefined && points !== 1 && points !== -1) throw new Error("Points must be either 1 or -1");

  if (product_id) {
    const product = await Product.findById(product_id);
    if (!product) throw new Error("Product not found");
    rating.product_id = product_id;
  }

  if (from_user_id) {
    const rater = await User.findById(from_user_id);
    if (!rater) throw new Error("Rater not found");
    rating.from_user_id = from_user_id;
  }

  if (to_user_id) {
    const rated = await User.findById(to_user_id);
    if (!rated) throw new Error("Target user for rating not found");
    rating.to_user_id = to_user_id;
  }

  if (comment !== undefined) rating.comment = comment;
  if (points !== undefined) rating.points = points;

  return await Rating.findByIdAndUpdate(id, rating, { new: true });
};

export const deleteRating = async (id) => {
  const deleted = await Rating.findByIdAndDelete(id);
  if (!deleted) throw new Error("Failed to delete rating");
  return deleted;
};

export const getRatingsByUser = async (userId) => {
  return await Rating.find({ to_user_id: userId })
    .populate("from_user_id product_id")
    .sort({ createdAt: -1 });
};
