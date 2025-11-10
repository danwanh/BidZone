import express from "express";
const router = express.Router();
import {
  getAllTopCategories,
  getLowerCategoriesById,
  createCategory,
  changeCategoryById,
  deleteCategoryById,
} from "../controllers/categoryController.js";

router.post("/", createCategory);
router.get("/", getAllTopCategories);
router.get("/:categoryId/subcategories", getLowerCategoriesById);
router.patch("/:categoryId", changeCategoryById);
router.delete("/:categoryId", deleteCategoryById);

export default router;
