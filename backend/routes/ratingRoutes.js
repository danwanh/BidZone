import express from "express";
import {
  getAllRatings,
  getRatingByID,
  createRating,
  updateRating,
  deleteRating,
} from "../controllers/ratingController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("", authenticate, getAllRatings);
router.get("/each/:id", getRatingByID);
router.get("/user/:id", getRatingByID);
router.post("/", createRating);
router.patch("/:id", updateRating);
router.delete("/:id", deleteRating);

export default router;
