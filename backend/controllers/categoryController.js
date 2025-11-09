import Category from "../models/category.model.js";

// POST /api/category
export const createCategory = async (req, res) => {
  try {
    const { category_id, name, slug } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newCategory = new Category({ category_id, name, slug });
    const savedCategory = await newCategory.save();

    res.status(201).json(savedCategory);
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// [GET] /api/category
export const getAllTopCategory = async (req, res) => {
  try {
    const categories = await Category.find({ category_id: null });
    res.status(200).json(categories);
  } catch (err) {
    console.error("Error fetching top level categories:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// [GET] /api/category/:categoryId
export const getLowerCategoriesById = async (req, res) => {
  try {
    const { id } = req.params;

    const categories = await Category.find({ category_id: id });
    res.status(200).json(categories);
  } catch (err) {
    console.error("Error fetching lower categories:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// [PATCH] /api/category/:categoryID
export const changeCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, name, slug } = req.body;

    // Update category
    const updated_category = await Category.findByIdAndUpdate(
      id,
      { category_id, name, slug },
      { new: true, runValidators: true } // return updated doc
    );

    // If id is not in db
    if (!updated_category) {
      return res.status(404).json({ message: "Category not found" });
    }
  } catch (err) {
    console.error("Error changing category:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// [DELETE] /api/category/:categoryID
export const deleteCategoryById = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) return res.status(404).json({ message: "Category not found" });

  await Category.deleteMany({ category_id: id });
  await Category.findByIdAndDelete(id);
};
