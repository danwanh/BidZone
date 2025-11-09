import express from "express";
const router = express.Router();
import {
  getAllTopCategory,
  getLowerCategoriesById,
  createCategory,
  changeCategoryById,
  deleteCategoryById,
} from "../controllers/categoryController.js";

router.post("/", createCategory);
router.get("/", getAllTopCategory);
router.get("/:categoryId", getLowerCategoriesById);
router.patch("/:categoryId", changeCategoryById);
router.delete("/:categoryId", deleteCategoryById);

export default router;
