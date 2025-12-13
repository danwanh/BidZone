import express from "express";
import {
  createBid,
  getBidsByProduct,
  getAllBids,
  deleteBid,
  getBidByUser,
  getBiddingByUser,
  getBidById,
  updateBidStatus
} from "../controllers/bidController.js";

const router = express.Router();

router.post("/", createBid);
router.get("/:id", getBidById);
router.get("/product/:product_id", getBidsByProduct);
router.get("/user/:id", getBidByUser);
router.get("/user/bidding/:id", getBiddingByUser);
router.get("/", getAllBids);
router.patch("/:id", updateBidStatus);
router.delete("/:id", deleteBid);

export default router;
