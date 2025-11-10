import express from "express";
const router = express.Router();

import { createWatchlist, getWatchlistByUserId, addToWatchlist, removeFromWatchlist } from "../controllers/watchlistController";
import { createElement } from "react";


router.post("/", createWatchlist);
router.get("/:userId", getWatchlistByUserId);
