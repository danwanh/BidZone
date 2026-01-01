import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import Category from "../models/category.model.js";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";
import fs from "fs";
import Watchlist from "../models/watchlist.model.js";
import Order from "../models/order.model.js";
import { sanitizeDescription } from "../utils/sanitizeHtml.js";

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
      is_autobid,
      status,
      total_bids,
      banned_bidders,
      allow_unrated_bidders,
      slug,
      image_url,
    } = req.validated.body;

    // if (!name || !seller_id || !start_price || !end_time) {
    //   return res.status(400).json({ message: "Missing required fields" });
    // }

    const seller = await User.findById(seller_id);
    if (!seller)
      return res.status(400).json({ message: "No user with that id" });
    if (seller.role !== "seller")
      return res.status(403).json({ message: "User is not a seller" });

    const category = await Category.findById(category_id);
    if (!category)
      return res.status(400).json({ message: "No category found" });

    const valid_statuses = ["active", "ended", "cancelled"];
    if (!valid_statuses.includes(status)) {
      return res.status(400).json({ message: "Wrong status value" });
    }

    const cleanDescription = description
      ? sanitizeDescription(description)
      : "";

    const newProduct = new Product({
      name,
      category_id,
      seller_id,
      start_price,
      bid_step,
      buy_now_price,
      current_price,
      start_time,
      end_time,
      is_autobid,
      image_url,
      status,
      total_bids,
      banned_bidders,
      allow_unrated_bidders,
      slug,

      description_history: cleanDescription
        ? [{ description: cleanDescription }]
        : [],
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Can't add product" });
  }
};

// GET
// GET /api/product
export const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      per_page = 6,
      q = "",
      categoryId,
      minPrice,
      maxPrice,
      sortBy,
      order,
      status = "active",
    } = req.query;

    const pageNum = Math.max(1, Number(page));
    const limit = Math.max(1, Number(per_page));
    const skip = (pageNum - 1) * limit;

    const filter = {};
    const sort = {};

    // Status
    if (status) {
      if (status === "all") {
        filter.status = {
          $in: ["active", "ended"],
        };
      } else {
        filter.status = status;
      }
    }

    //Category (cha hoặc con)
    if (categoryId) {
      const ids = categoryId.split(",");

      const selectedCategories = await Category.find({
        _id: { $in: ids },
      });

      if (!selectedCategories.length) {
        return res.status(400).json({ message: "No category found" });
      }

      const parentCategoryIds = [];
      let targetCategoryIds = [];

      selectedCategories.forEach((cat) => {
        if (cat.category_id == null) {
          // category CHA
          parentCategoryIds.push(cat._id);
          targetCategoryIds.push(cat._id);
        } else {
          // category CON
          targetCategoryIds.push(cat._id);
        }
      });

      if (parentCategoryIds.length > 0) {
        const subCategories = await Category.find({
          category_id: { $in: parentCategoryIds },
        }).select("_id");

        const subIds = subCategories.map((c) => c._id);
        targetCategoryIds = [...targetCategoryIds, ...subIds];
      }

      filter.category_id = { $in: targetCategoryIds };
    }

    //Filter
    if (minPrice || maxPrice) {
      filter.current_price = {};
      if (minPrice) filter.current_price.$gte = Number(minPrice);
      if (maxPrice) filter.current_price.$lte = Number(maxPrice);
    }

    // Sort
    if (sortBy && order) {
      const dir = order === "asc" ? 1 : -1;

      if (sortBy === "price") sort.current_price = dir;
      if (sortBy === "endtime") sort.end_time = dir;
    } else {
      // default
      sort.start_time = 1;
    }

    let products = {};
    let totalDocs = 0;

    if (q) {
      const pipeline = [
        {
          $search: {
            index: "product_search",
            text: {
              query: q,
              path: ["name", "description_history.description"],
              fuzzy: {
                maxEdits: 1,
              },
            },
          },
        },
        {
          $match: filter,
        },
        {
          $facet: {
            data: [
              { $sort: Object.keys(sort).length ? sort : { score: -1 } },
              { $skip: skip },
              { $limit: limit },

              // Category lookup
              {
                $lookup: {
                  from: "categories",
                  localField: "category_id",
                  foreignField: "_id",
                  as: "category",
                },
              },
              {
                $unwind: {
                  path: "$category",
                  preserveNullAndEmptyArrays: true,
                },
              },

              // Seller lookup
              {
                $lookup: {
                  from: "users",
                  localField: "seller_id",
                  foreignField: "_id",
                  as: "seller",
                },
              },
              { $unwind: "$seller" },

              {
                $addFields: {
                  // category fields
                  category: {
                    _id: "$category._id",
                    name: "$category.name",
                  },
                  // seller fields
                  seller: {
                    _id: "$seller._id",
                    username: "$seller.username",
                    email: "$seller.email",
                  },

                  score: { $meta: "searchScore" },
                },
              },
            ],
            total: [{ $count: "count" }],
          },
        },
      ];

      const result = await Product.aggregate(pipeline);

      products = result[0].data;
      totalDocs = result[0].total[0]?.count || 0;
    } else {
      [products, totalDocs] = await Promise.all([
        Product.find(filter)
          .populate("category_id", "name")
          .populate("seller_id", "username email")
          .sort(sort)
          .skip(skip)
          .limit(limit),
        Product.countDocuments(filter),
      ]);
    }
    res.status(200).json({
      message: "Got product list successfully!",
      page: pageNum,
      per_page: limit,
      total_page: Math.ceil(totalDocs / limit),
      products,
    });
  } catch (error) {
    console.error("Error getting all products:", error);
    res.status(500).json({ message: "Can't get all products" });
  }
};

// GET /api/product/:id
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.validated.params.id)
    .populate("seller_id")
    .populate("bidder_id");

  if (!product) {
    return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  }

  const auctionEnded = new Date(product.end_time) < new Date();

  if (auctionEnded && product.status !== "ended" && product.bidder_id) {
    const existedOrder = await Order.findOne({
      product_id: product._id,
    });

    if (!existedOrder) {
      await Order.create({
        product_id: product._id,
        seller_id: product.seller_id,
        buyer_id: product.bidder_id,
        status: "pending_payment",
      });
    }
    product.status = "ended";
  }

  await product.save();

  res.json(product);
};

// GET /api/product/user/:id
export const getBoughtByUserId = async (req, res) => {
  try {
    const { id: id } = req.validated.params;

    const products = await Product.find({
      bidder_id: id,
      status: "ended",
    }).populate("bidder_id");
    const { page = 1, per_page = 6, q = "" } = req.query;
    const page_number = Math.max(1, Number(page) || 1);
    const per_page_number = Math.max(1, Number(per_page) || 1);
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(q.toLowerCase())
    );
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
export const getBoughtByCategoryId = async (req, res) => {
  try {
    const { id } = req.validated.params;

    const categories = await Category.find({
      $or: [{ _id: id }, { category_id: id }],
    }).select(_id);

    categories.map((c) => {});
    const products = await Product.find({
      category_id: { $in: categories },
      status: "ended",
    }).populate("bidder_id");
    const { page = 1, per_page = 10000, q = "" } = req.validated.query;
    const page_number = Math.max(1, Number(page) || 1);
    const per_page_number = Math.max(1, Number(per_page) || 1);
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(q.toLowerCase())
    );
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

export const getProductByCategoryId = async (req, res) => {
  try {
    const { categoryId = "" } = req.validated.params;

    const category = await Category.findById(categoryId);

    if (!category)
      return res.status(400).json({ message: "No category found" });

    let products = await Product.find().populate("bidder_id");

    // Tim vategory con
    if (category.category_id == null) {
      const sub_category_ids = await Category.find({
        category_id: category._id,
      }).select("._id");

      products.filter((p) => sub_category_ids.includes(p.category_id));
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
    const { id } = req.validated.params;
    const {
      per_page = 1,
      page = 1,
      q = "",
      status = "active",
    } = req.query;

    // Check if seller id is valid
    const seller = await User.findById(id);
    if (!seller)
      return res.status(400).json({ message: "No user with that id" });
    if (seller.role !== "seller")
      return res.status(403).json({ message: "User is not a seller" });

    const products = await Product.find({ seller_id: id, status: status });

    if (products.length == 0)
      return res.json({ message: "No product found", products: [{}] });

    const page_number = Math.max(1, Number(page) || 1);
    const per_page_number = Math.max(1, Number(per_page) || 1);
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(q.toLowerCase())
    );
    const result = filtered.slice(
      (page_number - 1) * per_page_number,
      (page_number - 1) * per_page_number + per_page_number
    );
    const total_page = Math.ceil(filtered.length / per_page_number);

    return res
      .status(200)
      .json({ message: "Success!", total_page: total_page, products: result });
  } catch (error) {
    console.error("Error getting seller's product: ", error);
    res.status(500).json({ message: "Can't get seller's product" });
  }
};

// PATCH /api/product/:id
export const changeProductById = async (req, res) => {
  try {
    const { id: p_i } = req.validated.params;
    const { ban_bidder_id } = req.validated.body;

    const product = await Product.findById(p_i);
    if (!product) {
      return res.status(404).json({ message: "No product found with that id" });
    }

    if (ban_bidder_id) {
      if (!product.banned_bidders.includes(ban_bidder_id)) {
        product.banned_bidders.push(ban_bidder_id);
      }
    }

    const allowedFields = [
      "name",
      "description",
      "category_id",
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
      "allow_unrated_bidders",
      "slug",
    ];

    allowedFields.forEach((field) => {
      if (req.validated.body[field] !== undefined) {
        product[field] = req.validated.body[field];
      }
    });

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
    const { id: p_i } = req.validated.params;

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
      .populate("bidder_id")
      .sort({ end_time: 1 })
      .limit(5);
    return res.status(200).json({ products: products });
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
    return res.status(200).json({ products: products });
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
      .populate("bidder_id")
      .sort({ current_price: -1 })
      .limit(5);
    return res.status(200).json({ products: products });
  } catch (error) {
    console.error("Error getting top 5 most price: ", error);
    res.status(500).json({ message: "Can't get top 5 most price" });
  }
};

// GET /products/by-category/:id
export const getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.validated.params.id;
    const LIMIT = 5;

    console.log("ASDLJKASD " + typeof categoryId);

    const currentCategory = await Category.findById(categoryId);

    if (!currentCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    let products = await Product.find({ category_id: categoryId })
      .populate("bidder_id")
      .limit(LIMIT)
      .lean();

    // Nếu đủ 5 sản phẩm → trả về luôn
    if (products.length >= LIMIT) {
      return res.json(products);
    }

    // Nếu B thiếu sản phẩm → tìm category cha (A)
    const parentId = currentCategory.category_id;

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

// GET /products/by-category/simple/:id
export const getProductsByCategoryIdSimple = async (req, res) => {
  try {
    const id = req.validated.params.id;

    const categories = await Category.find({
      $or: [{ _id: id }, { category_id: id }],
    }).select("_id");

    if (categories.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    const { status = "" } = req.query;
    const STATUS =
      status !== "" && status !== "active" && status !== "ended" ? "" : status;

    const queryFilter = {
      category_id: { $in: categories },
    };

    if (STATUS !== "") {
      queryFilter.status = STATUS;
    }

    let products = await Product.find(queryFilter).populate("bidder_id").lean();

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

export const addDescriptionHistory = async (req, res) => {
  try {
    const { id } = req.validated.params;
    const { description } = req.validated.body;

    if (!description) {
      return res.status(400).json({
        message: "Description is required",
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      {
        $push: {
          description_history: {
            description,
            updated_at: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Description history added successfully",
      description_history: product.description_history,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
