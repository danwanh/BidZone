import Category from "../models/category.model.js";

// POST /api/category
export const createCategory = async (req, res) => {
  try {
    const { category_id, name, slug } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (category_id) {
      const parent = await Category.findById(category_id);
      if (!parent)
        return res.status(400).json({ message: `Can't find parent id: ${category_id}` });
    }

    const newCategory = new Category({ category_id, name, slug });
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
    res.status(200).json(categories);
  } catch (err) {
    console.error("Error fetching top level categories:", err);
    res.status(500).json({ message: `Can't get top categories` });
  }
};

// [GET] /api/category/:categoryId
export const getCategoryById = async (req, res) => {
  try {
    const { categoryId: c_i } = req.params;
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
    const { categoryId: c_i } = req.params;

    // Check if id is in database
    if(!await Category.findById(c_i))
      return res.status(404).json({message: "ID not found"});


    const categories = await Category.find({ category_id: c_i });
    if (categories.length === 0) {
      console.log(`No child found for: ${c_i}`);
      res.status(404).json({ message: "No child found" });
    } else {
      res.status(200).json(categories);
    }
  } catch (err) {
    console.error("Error fetching lower categories:", err);
    res.status(500).json({ message: "Error while reading child categories" });
  }
};

// [PATCH] /api/category/:categoryID
export const changeCategoryById = async (req, res) => {
  try {
    const { categoryId: c_i } = req.params;
    
    // Check if id is in database
    if(!await Category.findById(c_i))
      return res.status(404).json({message: "ID not found"});
    
    const updates = {};

    if (req.body.category_id !== undefined){
      const cat_id = req.body.category_id;
      const parent = await Category.findById(cat_id);
      if (!parent)
        return res.status(400).json({ message: `Can't find parent id: ${cat_id}` });
      updates.category_id = cat_id;
    } 
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.slug !== undefined) updates.slug = req.body.slug;


    const updated_category = await Category.findByIdAndUpdate(
      c_i,
      updates,
      { new: true, runValidators: true } // return updated doc
    );

    if (!updated_category) return res.status(404).json({ message: "Category not found" });
    else return res.status(200).json( updated_category );
  } catch (err) {
    console.error("Error changing category:", err);
    res.status(500).json({ message: "Couldn't change category" });
  }
};

// [DELETE] /api/category/:categoryID
export const deleteCategoryById = async (req, res) => {
  try{
      const { categoryId: c_i } = req.params;
    
      // Check if id is in database
      if(!await Category.findById(c_i))
        return res.status(404).json({message: "ID not found"});
    
      const category = await Category.findById(c_i);
      if (!category) return res.status(404).json({ message: "Category not found" });
    
      await Category.deleteMany({ category_id: c_i });
      await Category.findByIdAndDelete(c_i);
      res.status(204).json({ message: `Deleted category: ${c_i} and all child category` });
  }
  catch (error){
    console.error("Error deleting category:", error);
    res.status(500).json({ message: `Couldn't delete category: ${c_i}` });
  }
};
