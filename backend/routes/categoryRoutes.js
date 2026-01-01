import express from "express";
import {
  categoryIdParamSchema,
  createCategorySchema,
  updateCategorySchema,
} from "../schemas/CategorySchema.js";
import {
  getAllTopCategories,
  getLowerCategoriesById,
  createCategory,
  changeCategoryById,
  deleteCategoryById,
  getAllCategories,
  getCategoryById,
} from "../controllers/categoryController.js";

import { authenticate, isAdmin } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  isAdmin,
  validate({ body: createCategorySchema }),
  createCategory
);

router.get("/", getAllCategories);

router.get("/top", getAllTopCategories);

router.get(
  "/:categoryId",
  validate({ params: categoryIdParamSchema }),
  getCategoryById
);

router.get(
  "/subcategories/:categoryId",
  validate({ params: categoryIdParamSchema }),
  getLowerCategoriesById
);

router.patch(
  "/:categoryId",
  authenticate,
  isAdmin,
  validate({ params: categoryIdParamSchema, body: updateCategorySchema }),
  changeCategoryById
);

router.delete(
  "/:categoryId",
  authenticate,
  isAdmin,
  validate({ params: categoryIdParamSchema }),
  deleteCategoryById
);

export default router;
