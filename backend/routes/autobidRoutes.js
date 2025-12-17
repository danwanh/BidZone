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

const router = express.Router();

router.post("/", createAutoBid);
router.get("/", getAllAutoBids);
router.get("/:id", getAutoBidById);
router.get("/product/:product_id", getAutoBidsByProduct);
router.delete("/:id", deleteAutoBid);
router.patch("/:id", updateBidStatus);
router.patch("/:id/reject", rejectAutoBid);
export default router;
