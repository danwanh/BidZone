import Watchlist from "../models/watchlistModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";

export const createWatchlist = async (userData) => {
  const { user_id, product_id } = userData;

  if (!(await User.findById(user_id))) throw new Error(`User id not found: ${user_id}`);

  const existingWatchlist = await Watchlist.findOne({ user_id });
  if (existingWatchlist) throw new Error(`Watchlist already exists for this user: ${existingWatchlist._id}`);

  for (let id of product_id) {
    if (!(await Product.findById(id))) throw new Error(`Product id not found: ${id}`);
  }

  const newWatchlist = new Watchlist({ user_id, product_id });
  return await newWatchlist.save();
};

export const getAllWatchlists = async () => {
  const watchlists = await Watchlist.find();
  if (watchlists.length === 0) throw new Error("No watchlist found");
  return watchlists;
};

export const getWatchlistById = async (id) => {
  const watchlist = await Watchlist.findById(id);
  if (!watchlist) throw new Error(`No watchlist found with id: ${id}`);
  return watchlist;
};

export const getWatchlistByUserId = async (userId, queryParams) => {
  if (!(await User.findById(userId))) throw new Error("User id not found");

  const watchlist = await Watchlist.findOne({ user_id: userId }).populate({
    path: "product_id",
    populate: { path: "bidder_id category_id seller_id" },
  });

  if (!watchlist) throw new Error("No watchlist found");

  const { page = 1, per_page = 6, q = "" } = queryParams;
  const page_num = Math.max(1, Number(page) || 1);
  const per_page_num = Math.max(1, Number(per_page) || 6);
  const filtered = watchlist.product_id?.filter((p) =>
    p?.name?.toLowerCase().includes(q.toLowerCase())
  ) || [];

  const result = filtered.slice((page_num - 1) * per_page_num, (page_num - 1) * per_page_num + per_page_num);
  return {
    watchlist,
    total_page: Math.ceil(filtered.length / per_page_num),
    filtered: result,
  };
};

export const addToWatchlist = async (userId, productId) => {
  if (!(await User.findById(userId))) throw new Error("User id not found");
  if (!(await Product.findById(productId))) throw new Error("Product id not found");

  const updatedWatchlist = await Watchlist.findOneAndUpdate(
    { user_id: userId },
    { $addToSet: { product_id: productId } },
    { new: true }
  );
  if (!updatedWatchlist) throw new Error(`Watchlist not found for this user: ${userId}`);
  return updatedWatchlist;
};

export const removeFromWatchlist = async (userId, productId) => {
  if (!(await User.findById(userId))) throw new Error("User id not found");
  if (!(await Product.findById(productId))) throw new Error("Product id not found");

  const updatedWatchlist = await Watchlist.findOneAndUpdate(
    { user_id: userId },
    { $pull: { product_id: productId } },
    { new: true }
  );
  if (!updatedWatchlist) throw new Error("Watchlist not found");
  return updatedWatchlist;
};

export const removeWatchlist = async (userId) => {
  if (!(await User.findById(userId))) throw new Error("User id not found");
  return await Watchlist.findOneAndDelete({ user_id: userId });
};
