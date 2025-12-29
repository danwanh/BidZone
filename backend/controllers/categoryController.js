import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

// POST /api/category
export const createCategory = async (req, res) => {
  try {
    const { category_id, name, slug } = req.validated.body;

    // if (
    //   category_id &&
    //   category_id !== "" &&
    //   !mongoose.isValidObjectId(category_id)
    // ) {
    //   return res.status(400).json({ message: "Invalid category_id format" });
    // }
    const CATEGORY_ID = category_id === "" ? null : new ObjectId(category_id);

    // if (!name) {
    //   return res.status(400).json({ message: "Missing required fields" });
    // }

    if (CATEGORY_ID) {
      const parent = await Category.findById(CATEGORY_ID);
      if (!parent)
        return res
          .status(400)
          .json({ message: `Can't find parent id: ${CATEGORY_ID}` });
    }

    const newCategory = new Category({ category_id: CATEGORY_ID, name, slug });
    const savedCategory = await newCategory.save();

    res.status(201).json(savedCategory);
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ message: "Can't create category" });
  }
};

// [GET] /api/category
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: `Can't get categories` });
  }
};

// [GET] /api/category/top
export const getAllTopCategories = async (req, res) => {
  try {
    const categories = await Category.find({ category_id: null });
    res
      .status(200)
      .json({ message: "Successful pull", categories: categories || [] });
  } catch (err) {
    console.error("Error fetching top level categories:", err);
    res.status(500).json({ message: `Can't get top categories` });
  }
};

// [GET] /api/category/:categoryId
export const getCategoryById = async (req, res) => {
  try {
    const { categoryId: c_i } = req.validated.params;
    const category = await Category.findById(c_i);
    res.status(200).json(category);
  } catch (err) {
    console.error("Error fetching category:", err);
    res.status(500).json({ message: `Can't get category: ${c_i}` });
  }
};

// [GET] /api/category/:categoryId/subcategories
export const getLowerCategoriesById = async (req, res) => {
  try {
    const { categoryId: c_i } = req.validated.params;

    // Check if id is in database
    if (!(await Category.findById(c_i)))
      return res.status(404).json({ message: "ID not found" });

    const categories = await Category.find({ category_id: c_i });
    if (categories.length === 0) {
      console.log(`No child found for: ${c_i}`);
      res
        .status(200)
        .json({ message: `No child foud for ${c_i}`, categories: categories });
    } else {
      res
        .status(200)
        .json({ message: "Successful pull", categories: categories });
    }
  } catch (err) {
    console.error("Error fetching lower categories:", err);
    res.status(500).json({ message: "Error while reading child categories" });
  }
};

// [PATCH] /api/category/:categoryID
export const changeCategoryById = async (req, res) => {
  try {
    const { categoryId: c_i } = req.validated.params;

    // Check if id is in database
    if (!(await Category.findById(c_i)))
      return res.status(404).json({ message: "ID not found" });

    const updates = {};

    if (req.validated.body.category_id !== undefined) {
      const cat_id = req.validated.body.category_id;
      const parent = await Category.findById(cat_id);
      if (!parent)
        return res
          .status(400)
          .json({ message: `Can't find parent id: ${cat_id}` });
      updates.category_id = cat_id;
    }
    if (req.validated.body.name !== undefined) updates.name = req.validated.body.name;
    if (req.validated.body.slug !== undefined) updates.slug = req.validated.body.slug;

    const updated_category = await Category.findByIdAndUpdate(
      c_i,
      updates,
      { new: true, runValidators: true } // return updated doc
    );

    if (!updated_category)
      return res.status(404).json({ message: "Category not found" });
    else return res.status(200).json(updated_category);
  } catch (err) {
    console.error("Error changing category:", err);
    res.status(500).json({ message: "Couldn't change category" });
  }
};

// [DELETE] /api/category/:categoryID
export const deleteCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.validated.params;

    const category = await Category.findById(categoryId);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    const cat_id_list = await Category.find({
      $or: [{ _id: categoryId }, { category_id: categoryId }],
    }).select("_id");

    const products = await Product.find({ category_id: { $in: cat_id_list } });

    if (products.length > 0) {
      return res
        .status(404)
        .json({ message: "Can't delete category with products" });
    }

    await Category.deleteMany({ category_id: categoryId });
    await Category.findByIdAndDelete(categoryId);
    res.status(204).json({
      message: `Deleted category: ${categoryId} and all child category`,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: `Couldn't delete category` });
  }
};
