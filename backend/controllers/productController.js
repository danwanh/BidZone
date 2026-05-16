import * as productService from "../services/productService.js";

// POST /api/product
export const addProduct = async (req, res) => {
  try {
    const product = await productService.addProduct(req.validated.body);
    res.status(201).json(product);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(error.message === "No user with that id" || error.message === "No category found" || error.message === "Wrong status value" ? 400 : error.message === "User is not a seller" ? 403 : 500).json({ message: error.message || "Can't add product" });
  }
};

// GET /api/product
export const getAllProducts = async (req, res) => {
  try {
    const result = await productService.getAllProducts(req.query);
    res.status(200).json({
      message: "Got product list successfully!",
      page: result.pageNum,
      per_page: result.limit,
      total_page: result.total_page,
      products: result.products,
    });
  } catch (error) {
    console.error("Error getting all products:", error);
    res.status(error.message === "No category found" ? 400 : 500).json({ message: error.message || "Can't get all products" });
  }
};

// GET /api/product/:id
export const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.validated.params.id);
    res.json(product);
  } catch (error) {
    console.error("Error getting product by id:", error);
    res.status(error.message === "Không tìm thấy sản phẩm" ? 404 : 500).json({ message: error.message });
  }
};

// GET /api/product/user/:id
export const getBoughtByUserId = async (req, res) => {
  try {
    const result = await productService.getBoughtByUserId(req.validated.params.id, req.query);
    res.status(200).json({
      message: "Succesfully got bought list ",
      products: result.products,
      total_page: result.total_page,
    });
  } catch (error) {
    console.error("Error getting bought products by user:", error);
    res.status(500).json({ message: "Can't get product" });
  }
};

// GET /api/product/category/:id
export const getBoughtByCategoryId = async (req, res) => {
  try {
    const result = await productService.getBoughtByCategoryId(req.validated.params.id, req.validated.query);
    res.status(200).json({
      message: "Succesfully got bought list ",
      products: result.products,
      total_page: result.total_page,
    });
  } catch (error) {
    console.error("Error getting bought products by category:", error);
    res.status(500).json({ message: "Can't get product" });
  }
};

export const getProductByCategoryId = async (req, res) => {
  try {
    const products = await productService.getProductByCategoryId(req.validated.params.categoryId);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error getting product by category:", error);
    res.status(error.message === "No category found" ? 400 : 500).json({ message: error.message });
  }
};

// GET /api/product/:id/seller
export const getProductBySellerId = async (req, res) => {
  try {
    const result = await productService.getProductBySellerId(req.validated.params.id, req.query);
    res.status(200).json({
      message: "Thành công ",
      total_page: result.total_page,
      products: result.products,
    });
  } catch (error) {
    console.error("Error getting seller's product:", error);
    const status = error.message === "No user with that id" ? 400 : error.message === "User is not a seller" ? 403 : 500;
    res.status(status).json({ message: error.message || "Không thể lấy sản phẩm" });
  }
};

// PATCH /api/product/:id
export const changeProductById = async (req, res) => {
  try {
    const updatedProduct = await productService.updateProduct(req.validated.params.id, req.validated.body);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error changing product:", error);
    res.status(error.message === "No product found with that id" ? 404 : 500).json({ message: error.message });
  }
};

// DELETE
export const deleteProductById = async (req, res) => {
  try {
    const deletedProduct = await productService.deleteProduct(req.validated.params.id);
    res.status(200).json({ message: `Deleted product: ${deletedProduct.name}` });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(error.message.includes("No product found") ? 404 : 500).json({ message: error.message });
  }
};

// GET /api/product/top5/ending
export const getTop5Ending = async (req, res) => {
  try {
    const products = await productService.getTop5Ending();
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error getting top 5 ending:", error);
    res.status(500).json({ message: "Can't get top 5 ending" });
  }
};

// GET /api/product/top5/bid
export const getTop5Bid = async (req, res) => {
  try {
    const products = await productService.getTop5Bid();
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error getting top 5 most bids:", error);
    res.status(500).json({ message: "Can't get top 5 most bids" });
  }
};

// GET /api/product/top5/price
export const getTop5Price = async (req, res) => {
  try {
    const products = await productService.getTop5Price();
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error getting top 5 most price:", error);
    res.status(500).json({ message: "Can't get top 5 most price" });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await productService.getRecommendedProducts(req.validated.params.id);
    res.json(products);
  } catch (error) {
    console.error("Error getting recommended products:", error);
    res.status(error.message === "Product not found" ? 404 : 500).json({ message: error.message });
  }
};



// GET /products/by-category/simple/:id
export const getProductsByCategoryIdSimple = async (req, res) => {
  try {
    const products = await productService.getProductsByCategoryIdSimple(req.validated.params.id, req.query.status || "");
    res.json(products);
  } catch (error) {
    console.error("Error getting simple products by category:", error);
    res.status(error.message === "Category not found" ? 404 : 500).json({ message: error.message });
  }
};

export const getLikedProducts = (req, res) => {
  try {
    // Placeholder as it was empty in original
    res.status(200).json([]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const addDescriptionHistory = async (req, res) => {
  try {
    const history = await productService.addDescriptionHistory(req.validated.params.id, req.validated.body.description);
    res.status(200).json({
      message: "Description history added successfully",
      description_history: history,
    });
  } catch (error) {
    console.error("Error adding description history:", error);
    res.status(error.message === "Product not found" ? 404 : 500).json({ message: error.message });
  }
};

export const getBiddersByProductId = async (product) => {
  return await productService.getBiddersByProductId(product);
};
