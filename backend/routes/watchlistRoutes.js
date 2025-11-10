import express from "express";
const router = express.Router();

import { createWatchlist, getWatchlistByUserId, addToWatchlist, removeFromWatchlist, getAllWatchlist, removeWatchlist } from "../controllers/watchlistController.js";


router.post("/", createWatchlist);
router.get("/", getAllWatchlist);
router.get("/:userId", getWatchlistByUserId);
router.patch("/:userId/:productId", addToWatchlist);
router.delete("/:userId", removeWatchlist);
router.delete("/:userId/:productId", removeFromWatchlist);

export default router;