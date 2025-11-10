import express from "express";
import {
  createAutoBid,
  getAutoBidsByProduct,
  getAllAutoBids,
  deleteAutoBid,
} from "../controllers/autobidController.js";

const router = express.Router();

router.post("/", createAutoBid);
router.get("/", getAllAutoBids);
router.get("/product/:product_id", getAutoBidsByProduct);
router.delete("/:id", deleteAutoBid);

export default router;
