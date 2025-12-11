import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import Category from "../models/category.model.js";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";
import fs from "fs";
import Watchlist from "../models/watchlist.model.js";

// POST /api/product
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category_id,
      seller_id,
      start_price,
      bid_step,
      buy_now_price,
      current_price,
      start_time,
      end_time,
      bidder_id,
      is_autobid,
      status,
      total_bids,
      banned_bidders,
      allow_unrated_bidders,
      slug,
      image_url,
    } = req.body;

    // Check required fields
    if (!name || !seller_id || !start_price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if seller id is valid
    const seller = await User.findById(seller_id);
    if (!seller)
      return res.status(400).json({ message: "No user with that id" });
    if (seller.role !== "seller")
      return res.status(403).json({ message: "User is not a seller" });

    // Check if valid category id
    const category = await Category.findById(category_id);
    if (!category)
      return res
        .status(400)
        .json({ message: `No category with that id: ${category_id}` });

    // Check valid status
    const valid_statuses = ["active", "ended", "cancelled"];
    if (!valid_statuses.includes(status)) {
      return res.status(400).json({ message: "Wrong status value" });
    }

    const newProduct = new Product({
      name,
      description,
      category_id,
      seller_id,
      start_price,
      bid_step,
      buy_now_price,
      current_price,
      start_time,
      end_time,
      bidder_id,
      is_autobid,
      image_url,
      status,
      total_bids,
      banned_bidders,
      allow_unrated_bidders,
      slug,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product: ", error);
    res.status(500).json({ message: "Can't add product" });
  }
};
// GET
// GET /api/product
export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, q = "", per_page = 6 } = req.query;
    const pageNum = Math.max(1, Number(page) || 1);
    const perPageNum = Math.max(1, Number(per_page) || 6);

    const allProducts = await Product.find(); // <--- await here

    const filtered = allProducts.filter((p) =>
      p.name.toLowerCase().includes(q.toLowerCase())
    );

    const result = filtered.slice(
      (pageNum - 1) * perPageNum,
      (pageNum - 1) * perPageNum + perPageNum
    );

    const total_page = Math.ceil(filtered.length / perPageNum);

    res.status(200).json({
      message: "Got product list successfully!",
      total_page: total_page,
      page: pageNum,
      per_page: perPageNum,
      products: result,
    });
  } catch (error) {
    console.error("Error getting all products: ", error);
    res.status(500).json({ message: "Can't get all products" });
  }
};

// GET /api/product/:id
export const getProductById = async (req, res) => {
  try {
    const { id: p_i } = req.params;

    const product = await Product.findById(p_i).populate("seller_id");

    if (!product) return res.status(400).json({ message: "No product found" });
    else return res.status(200).json(product);
  } catch (error) {
    console.error("Error getting product: ", error);
    res.status(500).json({ message: "Can't get product" });
  }
};

// GET /api/product/user/:id
export const getBoughtByUserId = async (req, res) => {
  try {
    const { id: u_i } = req.params;
    console.log(u_i);

    const products = await Product.find({ bidder_id: u_i, status: "ended" });
    console.log("PRODUCTs" + products);
    const { page = 1, per_page = 6, q = "" } = req.query;
    const page_number = Math.max(1, Number(page) || 1);
    const per_page_number = Math.max(1, Number(per_page) || 1);
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(q.toLowerCase())
    );
    console.log(filtered);
    const result = filtered.slice(
      (page_number - 1) * per_page_number,
      (page_number - 1) * per_page_number + per_page_number
    );

    const total_page = Math.ceil(filtered.length / per_page_number);

    res.status(200).json({
      message: "Succesfully got bought list ",
      products: result,
      total_page: total_page,
    });
  } catch (error) {
    console.error("Error getting product: ", error);
    res.status(500).json({ message: "Can't get product" });
  }
};

// GET /api/product/category/:id
export const getProductByCategoryId = async (req, res) => {
  try {
    const { id: p_i } = req.params;

    const category = await Category.findById(p_i);

    if (!category)
      return res.status(400).json({ message: "No category found" });

    let products = [];

    if (category.category_id == null) {
      const sub_categories = await Category.find({ category_id: category._id });

      const product_promises = sub_categories.map((c) =>
        Product.find({ category_id: c._id })
      );

      const results = await Promise.all(product_promises);

      products = results.flat();
    } else {
      products = await Product.find({ category_id: category._id });
    }

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error getting product: ", error);
    res.status(500).json({ message: "Can't get product" });
  }
};

// GET /api/product/:id/seller
export const getProductBySellerId = async (req, res) => {
  try {
    const { id: p_i } = req.params;

    // Check if seller id is valid
    const seller = await User.findById(p_i);
    if (!seller)
      return res.status(400).json({ message: "No user with that id" });
    if (seller.role !== "seller")
      return res.status(403).json({ message: "User is not a seller" });

    const product = await Product.find({ seller_id: p_i });

    if (product.length == 0)
      return res.status(400).json({ message: "No product found" });

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error getting seller's product: ", error);
    res.status(500).json({ message: "Can't get seller's product" });
  }
};

// PATCH /api/product/:id
export const changeProductById = async (req, res) => {
  try {
    const { id: p_i } = req.params;

    // Find poduct
    const product = await Product.findById(p_i);
    if (!product) {
      return res.status(404).json({ message: "No product found with that id" });
    }

    // Only update fields that exist in req.body
    const allowedFields = [
      "name",
      "description",
      "category_id",
      "seller_id",
      "start_price",
      "bid_step",
      "buy_now_price",
      "current_price",
      "start_time",
      "end_time",
      "bidder_id",
      "is_autobid",
      "image_url",
      "status",
      "total_bids",
      "banned_bidders",
      "allow_unrated_bidders",
      "slug",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    // Save updated product
    const updatedProduct = await product.save();

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error changing product:", error);
    res.status(500).json({ message: "Can't change product" });
  }
};

// DELETE
export const deleteProductById = async (req, res) => {
  try {
    const { id: p_i } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(p_i);

    if (!deletedProduct)
      return res
        .status(404)
        .json({ message: `No product found with id: ${p_i}` });

    res
      .status(200)
      .json({ message: `Deleted product: ${deletedProduct.name}` });
  } catch (error) {
    console.error("Error deleting product: ", error);
    res.status(500).json({ message: "Can't delete product" });
  }
};

// GET /api/product/top5/ending
export const getTop5Ending = async (req, res) => {
  try {
    const now = new Date();
    const products = await Product.find({
      status: "active",
      end_time: { $exists: true, $gt: new Date() },
    })
      .sort({ end_time: 1 })
      .limit(5);
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error getting top 5 ending: ", error);
    res.status(500).json({ message: "Can't get top 5 ending" });
  }
};

// GET /api/product/top5/bid
export const getTop5Bid = async (req, res) => {
  try {
    let products = await Product.find({
      status: "active",
      total_bids: { $exists: true },
    })
      .sort({ total_bids: -1 })
      .limit(5);
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error getting top 5 most bids: ", error);
    res.status(500).json({ message: "Can't get top 5 most bids" });
  }
};

// GET /api/product/top5/price
export const getTop5Price = async (req, res) => {
  try {
    let products = await Product.find({
      status: "active",
      current_price: { $exists: true },
    })
      .sort({ current_price: -1 })
      .limit(5);
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error getting top 5 most price: ", error);
    res.status(500).json({ message: "Can't get top 5 most price" });
  }
};

// GET /products/by-category/:id
export const getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const LIMIT = 5;

    const currentCategory = await Category.findById(categoryId);

    if (!currentCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    let products = await Product.find({ category_id: categoryId })
      .limit(LIMIT)
      .lean();

    // Nếu đủ 5 sản phẩm → trả về luôn
    if (products.length >= LIMIT) {
      return res.json(products);
    }

    // Nếu B thiếu sản phẩm → tìm category cha (A)
    const parentId = currentCategory.parent_id;

    if (!parentId) {
      // Category không có cha (là category gốc)
      return res.json(products);
    }

    // Lấy tất cả category con của A: [B, C, D]
    const siblingCategories = await Category.find({
      parent_id: parentId,
      _id: { $ne: categoryId }, // bỏ B đi
    });

    const missing = LIMIT - products.length;

    // Lấy thêm product từ C và D
    for (const cat of siblingCategories) {
      if (products.length >= LIMIT) break;

      const need = LIMIT - products.length;

      const extraProducts = await Product.find({ category_id: cat._id })
        .limit(need)
        .lean();

      products = [...products, ...extraProducts];
    }

    return res.json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getLikedProducts = (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
