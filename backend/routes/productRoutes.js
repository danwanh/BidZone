import express from "express";
import {
  getProductsByCategory,
  getProductByCategoryId,
  addProduct,
  getAllProducts,
  getProductById,
  getBoughtByUserId,
  getProductBySellerId,
  deleteProductById,
  changeProductById,
  getTop5Bid,
  getTop5Ending,
  getTop5Price,
  getLikedProducts,
  addDescriptionHistory,
} from "../controllers/productController.js";
import upload from "../config/multer.js";
const router = express.Router();

const MAXIMUM_PICTURE_SENT = 25;

router.post("/", addProduct);
router.get("/", getAllProducts);
router.get("/user/:id", getBoughtByUserId);
router.get("/top5/ending", getTop5Ending);
router.get("/top5/bid", getTop5Bid);
router.get("/top5/price", getTop5Price);
router.get("/seller/:id", getProductBySellerId);
router.delete("/:id", deleteProductById);
router.patch("/:id", changeProductById);
router.get("/by-category/:id", getProductsByCategory);
router.get("/liked/:id", getLikedProducts);
router.get("/:id", getProductById);
router.patch("/des-history/:id/", addDescriptionHistory);

export default router;
