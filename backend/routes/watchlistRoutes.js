import express from "express";
const router = express.Router();

import { createWatchlist, getWatchlistByUserId, addToWatchlist, removeFromWatchlist, getAllWatchlist, getWatchlistById, removeWatchlist } from "../controllers/watchlistController.js";


router.post("/", createWatchlist);
router.get("/", getAllWatchlist);
router.get("/:id", getWatchlistById);
router.get("/user/:userId", getWatchlistByUserId);
router.patch("/:userId", addToWatchlist);
router.delete("/:userId", removeWatchlist);
router.delete("/:userId/:productId", removeFromWatchlist);

export default router;