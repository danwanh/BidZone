import Watchlist from "../models/watchlist.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";

// POST /api/watchlist
export const createWatchlist = async (req, res) => {
  try {
    const { user_id: u_i, product_id: p_i } = req.validated.body;
    // if (!u_i) {
    //   return res.status(400).json({ message: "Missing required user_id" });
    // }

    // Check if userId is in database
    if (!(await User.findById(u_i)))
      return res.status(404).json({ message: `User id not found: ${u_i}` });

    // Check if user already has watchlist
    const existingWatchlist = await Watchlist.findOne({ user_id: u_i });
    if (existingWatchlist)
      return res.status(409).json({
        message: `Watchlist already exists for this user: ${existingWatchlist._id}`,
      });

    // Check if productId is in database
    for (let id of p_i) {
      if (!(await Product.findById(id))) {
        return res.status(404).json({ message: `Product id not found: ${id}` });
      }
    }

    const newWatchlist = new Watchlist({
      user_id: u_i,
      product_id: p_i,
    });
    const savedWatchlist = await newWatchlist.save();

    res
      .status(201)
      .json({ message: "Create watchlist success", watchlist: savedWatchlist });
  } catch (error) {
    console.error("Error creating watchlist: ", error);
    res.status(500).json({ message: "Can't create watchlist" });
  }
};

// GET /api/watchlist
export const getAllWatchlist = async (req, res) => {
  try {
    const watchlists = await Watchlist.find();
    if (watchlists.length === 0) {
      console.log(`No watchlist in database`);
      return res.status(404).json({ message: "No watchlist found" });
    } else res.status(200).json(watchlists);
  } catch (error) {
    console.error("Error reading watchlists: ", error);
    res.status(500).json({ message: "Can't read all watchlists" });
  }
};

// GET /api/watchlist/:id
export const getWatchlistById = async (req, res) => {
  try {
    const { id } = req.validated.params;
    const watchlist = await Watchlist.findById(id);
    if (!watchlist) {
      console.log(`No watchlist found in database`);
      return res
        .status(404)
        .json({ message: `No watchlist found with id: ${id}` });
    } else res.status(200).json(watchlist);
  } catch (error) {
    console.error("Error reading watchlist: ", error);
    res.status(500).json({ message: "Can't read watchlist" });
  }
};

// GET /api/watchlist/user/:userId
export const getWatchlistByUserId = async (req, res) => {
  try {
    const { userId } = req.validated.params;

    // Check if userId is in database
    if (!(await User.findById(userId)))
      return res.status(404).json({ message: "User id not found" });

    const watchlist = await Watchlist.findOne({ user_id: userId }).populate({
      path: "product_id",
      populate: {
        path: "bidder_id category_id",
      },
    });
    if (!watchlist) {
      console.log("No watchlist");
      return res
        .status(400)
        .json({ message: "No watchlist found", products: watchlist });
    }
    const { page = 1, per_page = 6, q = "" } = req.query;
    const page_num = Math.max(1, Number(page) || 1);
    const per_page_num = Math.max(1, Number(per_page) || 6);
    const filtered = watchlist?.product_id?.filter((p) =>
      p?.name?.toLowerCase().includes(q.toLowerCase())
    );

    const result = filtered?.slice(
      (page_num - 1) * per_page_num,
      (page_num - 1) * per_page_num + per_page_num
    );
    const total_page = Math.ceil(filtered?.length / per_page_num);

    res.status(200).json({
      message: "Got successfully",
      watchlist: watchlist,
      total_page: total_page,
      filtered: result,
    });
  } catch (error) {
    console.error("Error reading watchlist: ", error);
    res.status(500).json({ message: "Can't read watchlist using user id" });
  }
};

// PATCH /api/watchlislt/:userId
export const addToWatchlist = async (req, res) => {
  try {
    const { userId } = req.validated.params;
    // console.log("req" + req.validated.data);
    let productId = req.validated.body.product_id;

    // if (!userId)
    //   return res.status(400).json({ message: "Missing required user id" });
    // if (!productId)
    //   return res.status(400).json({ message: "Missing required product id" });

    // Check if userId is in database
    if (!(await User.findById(userId)))
      return res.status(404).json({ message: "User id not found" });

    // Check if productId is in database
    if (!(await Product.findById(productId)))
      return res.status(404).json({ message: "Product id not found" });

    const updatedWatchlist = await Watchlist.findOneAndUpdate(
      { user_id: userId },
      { $addToSet: { product_id: productId } },
      { new: true }
    );
    if (!updatedWatchlist) {
      return res
        .status(404)
        .json({ message: `Watchlist not found for this user: ${userId}` });
    }

    res
      .status(200)
      .json({ message: "Product added to watchlist", updatedWatchlist });
  } catch (error) {
    console.error("Error adding to watchlist: ", error);
    res.status(500).json({ message: "Can't add product to watchlist" });
  }
};

// DELETE /api/watchlislt/:userId/:productId
export const removeFromWatchlist = async (req, res) => {
  try {
    const { userId, productId } = req.validated.params;

    // if (!userId)
    //   return res.status(400).json({ message: "Missing required user id" });
    // if (!productId)
    //   return res.status(400).json({ message: "Missing required product id" });

    // Check if userId is in database
    if (!(await User.findById(userId)))
      return res.status(404).json({ message: "User id not found" });

    // Check if productId is in database
    if (!(await Product.findById(productId)))
      return res.status(404).json({ message: "Product id not found" });

    const updatedWatchlist = await Watchlist.findOneAndUpdate(
      { user_id: userId },
      { $pull: { product_id: productId } },
      { new: true }
    );
    if (!updatedWatchlist)
      return res.status(404).json({ message: "Watchlist not found" });

    res
      .status(200)
      .json({ message: "Product removed from watchlist", updatedWatchlist });
  } catch (error) {
    console.error("Error removing from watchlist: ", error);
    res.status(500).json({ message: "Can't remove product from watchlist" });
  }
};

// DELETE /api/watchlislt/:userId
export const removeWatchlist = async (req, res) => {
  try {
    const { userId: u_i } = req.validated.params;

    // if (!u_i)
    //   return res.status(400).json({ message: "Missing required user id" });

    // Check if userId is in database
    if (!(await User.findById(u_i)))
      return res.status(404).json({ message: "User id not found" });

    await Watchlist.findOneAndDelete({ user_id: u_i });

    res.status(200).json({ message: "Watchlist removed", user_id: u_i });
  } catch (error) {
    console.error("Error removing watchlist: ", error);
    res.status(500).json({ message: "Server error" });
  }
};
