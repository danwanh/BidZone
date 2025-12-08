import Watchlist from "../models/watchlist.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";

// POST /api/watchlist
export const createWatchlist = async (req, res) => {
  try {
    const { user_id: u_i, product_id: p_i } = req.body;
    if (!u_i) {
      return res.status(400).json({ message: "Missing required user_id" });
    }

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
    if (!(await Product.findById(p_i)))
      return res.status(404).json({ message: `Product id not found: ${p_i}` });

    const newWatchlist = new Watchlist({
      user_id: u_i,
      product_id: p_i,
    });
    const savedWatchlist = await newWatchlist.save();

    res.status(201).json(savedWatchlist);
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
    const { id } = req.params;
    const watchlist = await Watchlist.findById(id);
    if (!watchlist) {
      console.log(`No watchlist in database`);
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
    const { userId } = req.params;

    // Check if userId is in database
    if (!(await User.findById(userId)))
      return res.status(404).json({ message: "User id not found" });

    const watchlist = await Watchlist.findOne({ user_id: userId }).populate(
      "product_id"
    );

    const { page = 1, per_page = 6, q = "" } = req.query;
    const page_num = Math.max(1, Number(page) || 1);
    const per_page_num = Math.max(1, Number(per_page) || 6);
    const filtered = watchlist.product_id.filter((p) =>
      p?.name?.toLowerCase().includes(q.toLowerCase())
    );

    const result = filtered.slice(
      (page_num - 1) * per_page_num,
      (page_num - 1) * per_page_num + per_page_num
    );
    const total_page = Math.ceil(filtered.length / per_page_num);

    if (!watchlist) {
      console.log(`No watchlist with user id: ${userId}`);
      return res
        .status(404)
        .json({ message: `No watchlist found for user: ${userId}` });
    } else
      res
        .status(200)
        .json({
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
    const { userId: u_i } = req.params;
    let p_i;
    if (req.body.product_id === undefined) p_i = null;
    else p_i = req.body.product_id;

    if (!u_i)
      return res.status(400).json({ message: "Missing required user id" });
    if (!p_i)
      return res.status(400).json({ message: "Missing required product id" });

    // Check if userId is in database
    if (!(await User.findById(u_i)))
      return res.status(404).json({ message: "User id not found" });

    // Check if productId is in database
    if (!(await Product.findById(p_i)))
      return res.status(404).json({ message: "Product id not found" });

    const updatedWatchlist = await Watchlist.findOneAndUpdate(
      { user_id: u_i },
      { $addToSet: { product_id: p_i } },
      { new: true } // create if it doesn't exist
    );
    if (!updatedWatchlist) {
      return res
        .status(404)
        .json({ message: `Watchlist not found for this user: ${u_i}` });
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
    const { userId: u_i, productId: p_i } = req.params;

    if (!u_i || !p_i)
      return res
        .status(400)
        .json({ message: "Missing required user id or product id" });

    // Check if userId is in database
    if (!(await User.findById(u_i)))
      return res.status(404).json({ message: "User id not found" });

    // Check if productId is in database
    if (!(await Product.findById(p_i)))
      return res.status(404).json({ message: "Product id not found" });

    const updatedWatchlist = await Watchlist.findOneAndUpdate(
      { user_id: u_i },
      { $pull: { product_id: p_i } },
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
    const { userId: u_i } = req.params;

    if (!u_i)
      return res.status(400).json({ message: "Missing required user id" });

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
