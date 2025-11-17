import express from "express";
const router = express.Router();
import {
  getAllTopCategories,
  getLowerCategoriesById,
  createCategory,
  changeCategoryById,
  deleteCategoryById,
  getAllCategories,
  getCategoryById
} from "../controllers/categoryController.js";

router.post("/", createCategory);
router.get("/", getAllCategories);
router.get("/top", getAllTopCategories);
router.get("/:categoryId", getCategoryById);
router.get("/subcategories/:categoryId", getLowerCategoriesById);
router.patch("/:categoryId", changeCategoryById);
router.delete("/:categoryId", deleteCategoryById);

export default router;
