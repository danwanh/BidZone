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
    const { categoryId } = req.params;

    // Check if id is in database
    if(!await Category.findById(categoryId))
      return res.status(404).json({message: "ID not found"});


    const categories = await Category.find({ category_id: categoryId });
    if (categories.length === 0) {
      console.log(`No child found: ${categoryId}`);
      res.status(404).json({ message: "No child found" });
    } else {
      res.status(200).json(categories);
    }
  } catch (err) {
    console.error("Error fetching lower categories:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// [PATCH] /api/category/:categoryID
export const changeCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    // Check if id is in database
    if(!await Category.findById(categoryId))
      return res.status(404).json({message: "ID not found"});
    
    const updates = {};

    if (req.body.category_id !== undefined) updates.category_id = req.body.category_id;
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.slug !== undefined) updates.slug = req.body.slug;

    const updated_category = await Category.findByIdAndUpdate(
      categoryId,
      updates,
      { new: true, runValidators: true } // return updated doc
    );

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
  const { categoryId } = req.params;

  // Check if id is in database
  if(!await Category.findById(categoryId))
    return res.status(404).json({message: "ID not found"});

  const category = await Category.findById(categoryId);
  if (!category) return res.status(404).json({ message: "Category not found" });

  await Category.deleteMany({ category_id: categoryId });
  await Category.findByIdAndDelete(categoryId);
  res.status(204).json({ message: "Deleted category" });
};
