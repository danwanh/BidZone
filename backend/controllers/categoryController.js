import * as categoryService from "../services/categoryService.js";

// POST /api/category
export const createCategory = async (req, res) => {
  try {
    const savedCategory = await categoryService.createCategory(req.validated.body);
    res.status(201).json(savedCategory);
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(err.message.includes("Can't find parent") ? 400 : 500).json({ message: err.message || "Can't create category" });
  }
};

// [GET] /api/category
export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: "Can't get categories" });
  }
};

// [GET] /api/category/top
export const getAllTopCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllTopCategories();
    res.status(200).json({ message: "Successful pull", categories: categories || [] });
  } catch (err) {
    console.error("Error fetching top level categories:", err);
    res.status(500).json({ message: "Can't get top categories" });
  }
};

// [GET] /api/category/:categoryId
export const getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.validated.params.categoryId);
    res.status(200).json(category);
  } catch (err) {
    console.error("Error fetching category:", err);
    res.status(500).json({ message: `Can't get category: ${req.validated.params.categoryId}` });
  }
};

// [GET] /api/category/:categoryId/subcategories
export const getLowerCategoriesById = async (req, res) => {
  try {
    const { categoryId } = req.validated.params;
    const categories = await categoryService.getLowerCategoriesById(categoryId);
    if (categories.length === 0) {
      res.status(200).json({ message: `No child foud for ${categoryId}`, categories: [] });
    } else {
      res.status(200).json({ message: "Successful pull", categories });
    }
  } catch (err) {
    console.error("Error fetching lower categories:", err);
    res.status(err.message === "ID not found" ? 404 : 500).json({ message: err.message || "Error while reading child categories" });
  }
};

// [PATCH] /api/category/:categoryID
export const changeCategoryById = async (req, res) => {
  try {
    const category = await categoryService.updateCategory(req.validated.params.categoryId, req.validated.body);
    res.status(200).json(category);
  } catch (err) {
    console.error("Error changing category:", err);
    const status = err.message === "ID not found" || err.message === "Category not found" ? 404 : err.message.includes("Can't find parent") ? 400 : 500;
    res.status(status).json({ message: err.message || "Couldn't change category" });
  }
};

// [DELETE] /api/category/:categoryID
export const deleteCategoryById = async (req, res) => {
  try {
    await categoryService.deleteCategory(req.validated.params.categoryId);
    res.status(204).json({ message: `Deleted category: ${req.validated.params.categoryId} and all child category` });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(error.message === "Category not found" || error.message === "Can't delete category with products" ? 404 : 500).json({ message: error.message || "Couldn't delete category" });
  }
};
