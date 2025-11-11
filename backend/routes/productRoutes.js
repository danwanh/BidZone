import express from  "express";
import { addProduct, getAllProducts, getProductById, getProductBySellerId, deleteProductById, changeProductById } from "../controllers/productController.js";
import upload from "../config/multer.js";
const router = express.Router();

const MAXIMUM_PICTURE_SENT = 25;

router.post("/", addProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/:id/seller", getProductBySellerId);
router.delete("/:id", deleteProductById);
router.patch("/:id", changeProductById);

export default router;