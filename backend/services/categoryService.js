import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

export const createCategory = async (categoryData) => {
  const { category_id, name, slug } = categoryData;
  const CATEGORY_ID = category_id === "" ? null : new ObjectId(category_id);

  if (CATEGORY_ID) {
    const parent = await Category.findById(CATEGORY_ID);
    if (!parent) throw new Error(`Can't find parent id: ${CATEGORY_ID}`);
  }

  const newCategory = new Category({ category_id: CATEGORY_ID, name, slug });
  return await newCategory.save();
};

export const getAllCategories = async () => {
  return await Category.find();
};

export const getAllTopCategories = async () => {
  return await Category.find({ category_id: null });
};

export const getCategoryById = async (id) => {
  return await Category.findById(id);
};

export const getLowerCategoriesById = async (id) => {
  const parent = await Category.findById(id);
  if (!parent) throw new Error("ID not found");
  return await Category.find({ category_id: id });
};

export const updateCategory = async (id, updateData) => {
  const category = await Category.findById(id);
  if (!category) throw new Error("ID not found");

  const updates = {};
  if (updateData.category_id !== undefined) {
    const cat_id = updateData.category_id;
    if (cat_id !== "" && mongoose.isValidObjectId(cat_id)) {
      const parent = await Category.findById(cat_id);
      if (!parent) throw new Error(`Can't find parent id: ${cat_id}`);
    }
    updates.category_id = cat_id === "" ? null : new ObjectId(cat_id);
  }
  if (updateData.name !== undefined) updates.name = updateData.name;
  if (updateData.slug !== undefined) updates.slug = updateData.slug;

  const updated = await Category.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!updated) throw new Error("Category not found");
  return updated;
};

export const deleteCategory = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw new Error("Category not found");

  const cat_id_list = await Category.find({ $or: [{ _id: id }, { category_id: id }] }).select("_id");
  const products = await Product.find({ category_id: { $in: cat_id_list } });

  if (products.length > 0) throw new Error("Can't delete category with products");

  await Category.deleteMany({ category_id: id });
  await Category.findByIdAndDelete(id);
  return category;
};
