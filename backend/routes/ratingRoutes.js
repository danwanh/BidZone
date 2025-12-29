import express from "express";
import {
  getAllRatings,
  getRatingByID,
  createRating,
  updateRating,
  deleteRating,
  getRatingsByUser,
} from "../controllers/ratingController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("", authenticate, getAllRatings);
router.get("/each/:id", getRatingByID);
router.get("/user/:userId", authenticate, getRatingsByUser);
router.post("/", createRating);
router.put("/:id", authenticate, updateRating);
router.delete("/:id", deleteRating);

export default router;
