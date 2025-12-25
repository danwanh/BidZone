import express from "express";
import {
  createUpgradeRequest,
  getAllUpgradeRequests,
  getUpgradeRequestsByUser,
  getUpgradeRequestById,
  reviewUpgradeRequest,
  cancelUpgradeRequest,
  deleteUpgradeRequest,
} from "../controllers/upgradeController.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE
// POST /api/upgrade
// Protected: Submit upgrade request (Bidder → Seller)
router.post("/", createUpgradeRequest);

// READ
// GET /api/upgrade
// Protected: Get all upgrade requests (Admin only)
router.get("/", authenticate, isAdmin, getAllUpgradeRequests);

// GET /api/upgrade/user/:user_id
// Protected: Get upgrade requests by user
router.get("/user/:user_id", authenticate, getUpgradeRequestsByUser);

// GET /api/upgrade/:id
// Protected: Get single upgrade request
router.get("/:id", authenticate, getUpgradeRequestById);

// UPDATE
// PUT /api/upgrade/:id/review
// Protected: Review (accept/reject) upgrade request (Admin only)
router.put("/:id/review", authenticate, isAdmin, reviewUpgradeRequest);

// PUT /api/upgrade/:id/cancel
// Protected: Cancel own upgrade request
router.put("/:id/cancel", authenticate, cancelUpgradeRequest);

// DELETE
// DELETE /api/upgrade/:id
// Protected: Delete upgrade request (Admin only)
router.delete("/:id", authenticate, deleteUpgradeRequest);

export default router;
