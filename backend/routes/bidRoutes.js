import express from "express";
import { createBid, getBidsByProduct } from "../controllers/bidController.js";

const router = express.Router();

router.post("/", createBid);
router.get("/:product_id", getBidsByProduct);

export default router;
