import * as watchlistService from "../services/watchlistService.js";

// POST /api/watchlist
export const createWatchlist = async (req, res) => {
  try {
    const savedWatchlist = await watchlistService.createWatchlist(req.validated.body);
    res.status(201).json({ message: "Create watchlist success", watchlist: savedWatchlist });
  } catch (error) {
    console.error("Error creating watchlist: ", error);
    const status = error.message.includes("not found") ? 404 : error.message.includes("already exists") ? 409 : 500;
    res.status(status).json({ message: error.message || "Can't create watchlist" });
  }
};

// GET /api/watchlist
export const getAllWatchlist = async (req, res) => {
  try {
    const watchlists = await watchlistService.getAllWatchlists();
    res.status(200).json(watchlists);
  } catch (error) {
    console.error("Error reading watchlists: ", error);
    res.status(error.message === "No watchlist found" ? 404 : 500).json({ message: error.message || "Can't read all watchlists" });
  }
};

// GET /api/watchlist/:id
export const getWatchlistById = async (req, res) => {
  try {
    const watchlist = await watchlistService.getWatchlistById(req.validated.params.id);
    res.status(200).json(watchlist);
  } catch (error) {
    console.error("Error reading watchlist: ", error);
    res.status(error.message.includes("No watchlist found") ? 404 : 500).json({ message: error.message || "Can't read watchlist" });
  }
};

// GET /api/watchlist/user/:userId
export const getWatchlistByUserId = async (req, res) => {
  try {
    const result = await watchlistService.getWatchlistByUserId(req.validated.params.userId, req.query);
    res.status(200).json({
      message: "Got successfully",
      watchlist: result.watchlist,
      total_page: result.total_page,
      filtered: result.filtered,
    });
  } catch (error) {
    console.error("Error reading watchlist: ", error);
    const status = error.message === "User id not found" ? 404 : error.message === "No watchlist found" ? 400 : 500;
    res.status(status).json({ message: error.message || "Can't read watchlist using user id" });
  }
};

// PATCH /api/watchlislt/:userId
export const addToWatchlist = async (req, res) => {
  try {
    const updatedWatchlist = await watchlistService.addToWatchlist(req.validated.params.userId, req.validated.body.product_id);
    res.status(200).json({ message: "Product added to watchlist", updatedWatchlist });
  } catch (error) {
    console.error("Error adding to watchlist: ", error);
    const status = error.message.includes("not found") ? 404 : 500;
    res.status(status).json({ message: error.message || "Can't add product to watchlist" });
  }
};

// DELETE /api/watchlislt/:userId/:productId
export const removeFromWatchlist = async (req, res) => {
  try {
    const updatedWatchlist = await watchlistService.removeFromWatchlist(req.validated.params.userId, req.validated.params.productId);
    res.status(200).json({ message: "Product removed from watchlist", updatedWatchlist });
  } catch (error) {
    console.error("Error removing from watchlist: ", error);
    const status = error.message.includes("not found") ? 404 : 500;
    res.status(status).json({ message: error.message || "Can't remove product from watchlist" });
  }
};

// DELETE /api/watchlislt/:userId
export const removeWatchlist = async (req, res) => {
  try {
    await watchlistService.removeWatchlist(req.validated.params.userId);
    res.status(200).json({ message: "Watchlist removed", user_id: req.validated.params.userId });
  } catch (error) {
    console.error("Error removing watchlist: ", error);
    res.status(error.message === "User id not found" ? 404 : 500).json({ message: error.message || "Server error" });
  }
};
