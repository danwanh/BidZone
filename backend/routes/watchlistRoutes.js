import express from "express";
const router = express.Router();

import {
  createWatchlist,
  getWatchlistByUserId,
  addToWatchlist,
  removeFromWatchlist,
  getAllWatchlist,
  getWatchlistById,
  removeWatchlist,
} from "../controllers/watchlistController.js";

import { validate } from "../middleware/validateMiddleware.js"; // Middleware để xác thực dữ liệu
import {
  watchlistUserIdSchema,
  productIdSchema,
  watchlistIdSchema,
  createWatchlistBodySchema,
  addToWatchlistBodySchema,
  deleteWatchlistSchema,
} from "../schemas/WatchlistSchema.js";

import { authenticate, isAdmin } from "../middleware/authMiddleware.js";

// CREATE
// POST /api/watchlist
router.post(
  "/",
  authenticate,
  validate({ body: createWatchlistBodySchema }),
  createWatchlist
);

// READ
// GET /api/watchlist - Get all watchlists (Admin only)
router.get("/", authenticate, isAdmin, getAllWatchlist);

// GET /api/watchlist/:id - Get watchlist by ID
router.get(
  "/:id",
  authenticate,
  validate({ params: watchlistIdSchema }),
  getWatchlistById
);

// GET /api/watchlist/user/:userId - Get watchlist by userId
router.get(
  "/user/:userId",
  authenticate,
  validate({ params: watchlistUserIdSchema }),
  getWatchlistByUserId
);

// UPDATE
// PATCH /api/watchlist/:userId - Add product to watchlist
router.patch(
  "/:userId",
  authenticate,
  validate({ params: watchlistUserIdSchema, body: addToWatchlistBodySchema }),
  addToWatchlist
);

// DELETE
// DELETE /api/watchlist/:userId/:productId - Remove product from watchlist
router.delete(
  "/:userId/:productId",
  authenticate,
  validate({ params: deleteWatchlistSchema }),
  removeFromWatchlist
);

// DELETE /api/watchlist/:userId - Remove watchlist
router.delete(
  "/:userId",
  authenticate,
  validate({ params: watchlistUserIdSchema }),
  removeWatchlist
);

export default router;


