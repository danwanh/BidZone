import express from "express";
import { createBid, getBidsByProduct, getAllBids, updateBid, deleteBid } from "../controllers/bidController.js";

const router = express.Router();

router.post("/", createBid);
router.get("/:product_id", getBidsByProduct);
router.get("/", getAllBids);
router.put("/:id", updateBid);
router.delete("/:id", deleteBid);

export default router;
