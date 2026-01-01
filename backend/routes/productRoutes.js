import express from "express";
import {
  createProductSchema,
  productIdParamSchema,
  updateProductSchema,
} from "../schemas/ProductSchema.js";
import {
  getProductsByCategory,
  getProductByCategoryId,
  addProduct,
  getAllProducts,
  getProductById,
  getBoughtByUserId,
  getBoughtByCategoryId,
  getProductsByCategoryIdSimple,
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

import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

const MAXIMUM_PICTURE_SENT = 25;

router.post("/", validate({ body: createProductSchema }), addProduct);
router.get("/", getAllProducts);
router.get(
  "/user/:id",
  validate({ params: productIdParamSchema }),
  getBoughtByUserId
);
router.get(
  "/by-category/bought/:id",
  validate({ params: productIdParamSchema }),
  getBoughtByCategoryId
);
router.get(
  "/by-category/simple/:id",
  validate({ params: productIdParamSchema }),
  getProductsByCategoryIdSimple
);
router.get("/top5/ending", getTop5Ending);
router.get("/top5/bid", getTop5Bid);
router.get("/top5/price", getTop5Price);
router.get(
  "/seller/:id",
  validate({ params: productIdParamSchema }),
  getProductBySellerId
);
router.delete("/:id", deleteProductById);
router.patch(
  "/:id",
  validate({ params: productIdParamSchema, body: updateProductSchema }),
  changeProductById
);
router.get(
  "/by-category/:id",
  validate({ params: productIdParamSchema }),
  getProductsByCategory
);
router.get("/liked/:id", getLikedProducts);
router.get("/:id", validate({ params: productIdParamSchema }), getProductById);
router.patch("/des-history/:id/", addDescriptionHistory);

export default router;
