import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import Category from "../models/categoryModel.js";
import Order from "../models/orderModel.js";
import AutoBid from "../models/autobidModel.js";
import Bid from "../models/bidModel.js";
import { sanitizeDescription } from "../utils/sanitizeHtml.js";
import appEvent from "./mailSystem/mailEvents.js";
import mongoose from "mongoose";
import * as vectorUtils from "../utils/vectorUtils.js";


export const addProduct = async (productData) => {
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
  } = productData;

  const seller = await User.findById(seller_id);
  if (!seller) throw new Error("No user with that id");
  if (seller.role !== "seller") throw new Error("User is not a seller");

  const category = await Category.findById(category_id);
  if (!category) throw new Error("No category found");

  const valid_statuses = ["active", "ended", "cancelled"];
  if (!valid_statuses.includes(status)) {
    throw new Error("Wrong status value");
  }

  const cleanDescription = description ? sanitizeDescription(description) : "";

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
    description_history: cleanDescription ? [{ description: cleanDescription }] : [],
  });

  return await newProduct.save();
};

export const getAllProducts = async (queryParams) => {
  const {
    page = 1,
    per_page = 6,
    q = "",
    categoryId,
    minPrice,
    maxPrice,
    fromDate,
    toDate,
    sortBy,
    order,
    status = "active",
    justPosted,
  } = queryParams;

  const pageNum = Math.max(1, Number(page));
  const limit = Math.max(1, Number(per_page));
  const skip = (pageNum - 1) * limit;

  const filter = {};
  const sort = {};

  if (status) {
    if (status === "all") {
      filter.status = { $in: ["active", "ended"] };
    } else {
      filter.status = status;
    }
  }

  if (categoryId) {
    const ids = categoryId.split(",");
    const selectedCategories = await Category.find({ _id: { $in: ids } });

    if (!selectedCategories.length) {
      throw new Error("No category found");
    }

    const parentCategoryIds = [];
    let targetCategoryIds = [];

    selectedCategories.forEach((cat) => {
      if (cat.category_id == null) {
        parentCategoryIds.push(cat._id);
        targetCategoryIds.push(cat._id);
      } else {
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

  if (minPrice || maxPrice) {
    filter.current_price = {};
    if (minPrice) filter.current_price.$gte = Number(minPrice);
    if (maxPrice) filter.current_price.$lte = Number(maxPrice);
  }

  if (fromDate || toDate) {
    filter.end_time = {};
    if (fromDate) filter.end_time.$gte = new Date(fromDate);
    if (toDate) {
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      filter.end_time.$lte = end;
    }
  }

  if (justPosted === "true") {
    const twoHoursAgo = new Date();
    twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);
    filter.start_time = { $gte: twoHoursAgo };
  }

  if (sortBy && order) {
    const dir = order === "asc" ? 1 : -1;
    if (sortBy === "price") sort.current_price = dir;
    if (sortBy === "endtime") sort.end_time = dir;
  } else {
    sort.start_time = 1;
  }

  let products = [];
  let totalDocs = 0;

  if (q) {
    const pipeline = [
      {
        $search: {
          index: "product_search",
          text: {
            query: q,
            path: ["name", "description_history.description"],
            fuzzy: { maxEdits: 1 },
          },
        },
      },
      { $match: filter },
      { $addFields: { score: { $meta: "searchScore" } } },
      {
        $facet: {
          data: [
            { $sort: sortBy && order ? sort : { score: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: "categories",
                localField: "category_id",
                foreignField: "_id",
                as: "category",
              },
            },
            { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
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
              $lookup: {
                from: "users",
                localField: "bidder_id",
                foreignField: "_id",
                as: "bidder_id",
              },
            },
            { $unwind: { path: "$bidder_id", preserveNullAndEmptyArrays: true } },
            {
              $addFields: {
                category: { _id: "$category._id", name: "$category.name" },
                seller: { _id: "$seller._id", username: "$seller.username", email: "$seller.email" },
                bidder_id: { _id: "$bidder_id._id", username: "$bidder_id.username", name: "$bidder_id.name" },
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
        .populate("bidder_id")
        .populate("seller_id", "username email name")
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
    ]);
  }

  return {
    products,
    totalDocs,
    pageNum,
    limit,
    total_page: Math.ceil(totalDocs / limit),
  };
};

export const getProductById = async (id) => {
  const product = await Product.findById(id)
    .populate("seller_id", "rating_pos rating_neg name")
    .populate("category_id")
    .populate("bidder_id", "rating_pos rating_neg name");

  if (!product) throw new Error("Không tìm thấy sản phẩm");

  const auctionEnded = new Date(product.end_time) < new Date();

  if (auctionEnded && product.status !== "ended" && product.bidder_id) {
    const existedOrder = await Order.findOne({ product_id: product._id });
    if (!existedOrder) {
      await Order.create({
        product_id: product._id,
        seller_id: product.seller_id,
        buyer_id: product.bidder_id,
        status: "pending_payment",
      });
    }
    product.status = "ended";
    await product.save();
  }

  return product;
};

export const getBoughtByUserId = async (userId, queryParams) => {
  const { page = 1, per_page = 6, q = "" } = queryParams;
  const products = await Product.find({ bidder_id: userId, status: "ended" })
    .populate("bidder_id seller_id")
    .populate("category_id", "name");

  const page_number = Math.max(1, Number(page) || 1);
  const per_page_number = Math.max(1, Number(per_page) || 1);
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase())
  );
  const result = filtered.slice(
    (page_number - 1) * per_page_number,
    (page_number - 1) * per_page_number + per_page_number
  );

  return {
    products: result,
    total_page: Math.ceil(filtered.length / per_page_number),
  };
};

export const getBoughtByCategoryId = async (categoryId, queryParams) => {
  const { page = 1, per_page = 10000, q = "" } = queryParams;
  const categories = await Category.find({
    $or: [{ _id: categoryId }, { category_id: categoryId }],
  }).select("_id");

  const products = await Product.find({
    category_id: { $in: categories },
    status: "ended",
  })
    .populate("bidder_id seller_id")
    .populate("category_id", "name");

  const page_number = Math.max(1, Number(page) || 1);
  const per_page_number = Math.max(1, Number(per_page) || 1);
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase())
  );
  const result = filtered.slice(
    (page_number - 1) * per_page_number,
    (page_number - 1) * per_page_number + per_page_number
  );

  return {
    products: result,
    total_page: Math.ceil(filtered.length / per_page_number),
  };
};

export const getProductByCategoryId = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) throw new Error("No category found");

  let products = await Product.find()
    .populate("bidder_id")
    .populate("category_id", "name");

  if (category.category_id == null) {
    const sub_category_ids = await Category.find({ category_id: category._id }).select("_id");
    const ids = sub_category_ids.map(c => c._id.toString());
    products = products.filter((p) => ids.includes(p.category_id?._id?.toString()));
  } else {
    products = await Product.find({ category_id: category._id }).populate("bidder_id");
  }
  return products;
};

export const getProductBySellerId = async (sellerId, queryParams) => {
  const {
    per_page = 1,
    page = 1,
    q = "",
    status = "active",
    bidder_id_exists = "false",
  } = queryParams;
  const bidder_exists = bidder_id_exists.toLowerCase() === "true";

  const seller = await User.findById(sellerId);
  if (!seller) throw new Error("No user with that id");
  if (seller.role !== "seller") throw new Error("User is not a seller");

  const filter = { seller_id: sellerId, status: status };
  if (bidder_exists) filter.bidder_id = { $exists: true };

  const products = await Product.find(filter)
    .populate("bidder_id")
    .populate("category_id", "name");

  const page_number = Math.max(1, Number(page) || 1);
  const per_page_number = Math.max(1, Number(per_page) || 1);
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase())
  );
  const result = filtered.slice(
    (page_number - 1) * per_page_number,
    (page_number - 1) * per_page_number + per_page_number
  );

  return {
    products: result,
    total_page: Math.ceil(filtered.length / per_page_number),
  };
};

export const updateProduct = async (id, updateData) => {
  const { ban_bidder_id, ...otherData } = updateData;
  const product = await Product.findById(id);
  if (!product) throw new Error("No product found with that id");

  if (ban_bidder_id) {
    if (!product.banned_bidders.includes(ban_bidder_id)) {
      product.banned_bidders.push(ban_bidder_id);
    }
  }

  const allowedFields = [
    "name", "description", "category_id", "start_price", "bid_step",
    "buy_now_price", "current_price", "start_time", "end_time", "bidder_id",
    "is_autobid", "image_url", "status", "total_bids", "allow_unrated_bidders", "slug"
  ];

  allowedFields.forEach((field) => {
    if (otherData[field] !== undefined) {
      product[field] = otherData[field];
    }
  });

  return await product.save();
};

export const deleteProduct = async (id) => {
  const deletedProduct = await Product.findByIdAndDelete(id);
  if (!deletedProduct) throw new Error(`No product found with id: ${id}`);
  return deletedProduct;
};

export const getTop5Ending = async () => {
  return await Product.find({
    status: "active",
    end_time: { $exists: true, $gt: new Date() },
  })
    .populate("bidder_id seller_id")
    .populate("category_id", "name")
    .sort({ end_time: 1 })
    .limit(5);
};

export const getTop5Bid = async () => {
  return await Product.find({
    status: "active",
    total_bids: { $exists: true },
  })
    .populate("bidder_id seller_id")
    .populate("category_id", "name")
    .sort({ total_bids: -1 })
    .limit(5);
};

export const getTop5Price = async () => {
  return await Product.find({
    status: "active",
    current_price: { $exists: true },
  })
    .populate("bidder_id seller_id")
    .populate("category_id", "name")
    .sort({ current_price: -1 })
    .limit(5);
};

export const getRecommendedProducts = async (productId) => {
  const LIMIT = 5;
  
  const targetProduct = await Product.findById(productId).populate("category_id");
  if (!targetProduct) throw new Error("Product not found");

  const categoryId = targetProduct.category_id._id;
  const parentCategoryId = targetProduct.category_id.category_id;

  const candidates = await Product.find({
    _id: { $ne: productId },
    status: "active",
    end_time: { $gt: new Date() }
  }).populate("category_id").lean();

  if (candidates.length === 0) return [];

  const stats = candidates.reduce((acc, p) => {
    acc.maxBids = Math.max(acc.maxBids, p.total_bids || 0);
    acc.maxPrice = Math.max(acc.maxPrice, p.current_price || 0);
    return acc;
  }, { maxBids: 0, maxPrice: 0 });

  const categoryCounts = {};
  candidates.forEach(p => {
    const catId = p.category_id._id.toString();
    categoryCounts[catId] = (categoryCounts[catId] || 0) + 1;
  });

  const now = new Date().getTime();

  const scoredProducts = candidates.map(p => {
    const features = {}; // category, popularity, demand, avg bid, rarity

    if (p.category_id._id.toString() === categoryId.toString()) {
      features.category = 1.0;
    } else if (parentCategoryId && p.category_id.category_id?.toString() === parentCategoryId.toString()) {
      features.category = 0.5;
    } else {
      features.category = 0.0;
    }

    features.popularity = vectorUtils.normalize(p.total_bids || 0, 0, stats.maxBids || 1);

    const timeLeft = new Date(p.end_time).getTime() - now;
    const hoursLeft = Math.max(0, timeLeft / (1000 * 60 * 60));
    features.demand = 1 / (hoursLeft + 1);

    const avgBid = (p.current_price || 0) / (p.total_bids || 1);
    features.avgBid = vectorUtils.normalize(avgBid, 0, stats.maxPrice || 1);

    const countInCat = categoryCounts[p.category_id._id.toString()] || 1;
    features.rarity = 1 / countInCat;

    const targetVector = {
      category: 1.0,
      popularity: vectorUtils.normalize(targetProduct.total_bids || 0, 0, stats.maxBids || 1),
      demand: 1 / (Math.max(0, (new Date(targetProduct.end_time).getTime() - now) / 3600000) + 1),
      avgBid: vectorUtils.normalize((targetProduct.current_price || 0) / (targetProduct.total_bids || 1), 0, stats.maxPrice || 1),
      rarity: 1 / (categoryCounts[categoryId.toString()] || 1)
    };

    const similarity = vectorUtils.cosineSimilarity(features, targetVector);
    
    return { ...p, similarity };
  });

  return scoredProducts
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, LIMIT);
};



export const getProductsByCategoryIdSimple = async (id, status) => {
  const categories = await Category.find({
    $or: [{ _id: id }, { category_id: id }],
  }).select("_id");

  if (categories.length === 0) throw new Error("Category not found");

  const STATUS = status !== "" && status !== "active" && status !== "ended" ? "" : status;
  const queryFilter = { category_id: { $in: categories } };
  if (STATUS !== "") queryFilter.status = STATUS;

  return await Product.find(queryFilter).populate("bidder_id").lean();
};

export const addDescriptionHistory = async (id, description) => {
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

  if (!product) throw new Error("Product not found");

  if (product.description_history.length >= 1) {
    const bidders = await getBiddersByProductId(product);
    if (bidders.length > 0) {
      appEvent.emit("DESCRIPTION_CHANGE", { bidders, product, description });
    }
  }

  return product.description_history;
};

export const getBiddersByProductId = async (product) => {
  let bidderIds = [];
  if (product.is_autobid) {
    const autoBids = await AutoBid.find({
      product_id: product._id,
      status: true,
    }).select("bidder_id");
    bidderIds = autoBids.map((b) => b.bidder_id);
  } else {
    const bids = await Bid.find({
      product_id: product._id,
      status: true,
    }).select("bidder_id");
    bidderIds = bids.map((b) => b.bidder_id);
  }

  bidderIds = [...new Set(bidderIds.map((id) => id.toString()))];

  return User.find({
    _id: { $in: bidderIds },
    is_deleted: false,
  }).select("email name");
};
