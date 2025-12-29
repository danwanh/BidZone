import express from "express";
import {
  createAutoBid,
  getAutoBidsByProduct,
  getAllAutoBids,
  deleteAutoBid,
  getAutoBidById,
  updateBidStatus,
  rejectAutoBid
} from "../controllers/autobidController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createAutoBid);
router.get("/", authenticate, getAllAutoBids);
router.get("/:id", authenticate, getAutoBidById);
router.get("/product/:product_id", authenticate, getAutoBidsByProduct);
router.delete("/:id", authenticate, deleteAutoBid);
router.patch("/:id", authenticate, updateBidStatus);
router.patch("/:id/reject", authenticate, rejectAutoBid);
export default router;
