import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import Category from "../models/category.model.js";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";
import fs from "fs";

// POST /api/product
export const addProduct = async (req, res) => {
    try{
        const { name, description, category_id, seller_id, start_price, bid_step, buy_now_price, current_price, start_time, end_time, bidder_id, is_autobid, status, total_bids, banned_bidders, allow_unrated_bidders, slug, image_url } = req.body;
        
        // Check required fields
        if (!name || !seller_id || !start_price ){
            return res.status(400).json( {message: "Missing required fields"} );
        }

        // Check if seller id is valid
        const seller = await User.findById( seller_id );
        if(!seller)
            return res.status(400).json ({message: "No user with that id"});
        if (seller.role !== "seller")
            return res.status(403).json({ message: "User is not a seller" });
    
        // Check if valid category id
        const category = await Category.findById(category_id);
        if(!category)
            return res.status(400).json ({message: `No category with that id: ${category_id}`});
        
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
    }
    catch (error) {
        console.error("Error adding product: ", error);
        res.status(500).json( {message: "Can't add product"} );
    }
}
// GET
// GET /api/product
export const getAllProducts = async (req, res) => {
    try{
        const products = await Product.find();

        if(products.length == 0)
            return res.status(400).json( {message: "No product in database" });

        return res.status(200).json(products);
    }
    catch (error) {
        console.error("Error getting all products: ", error);
        res.status(500).json( {message: "Can't get all products"} );
    }
}

// GET /api/product/:id
export const getProductById = async (req, res) => {
    try{
        const { id:p_i } = req.params;

        const product = await Product.findById(p_i);

        if (!product) return res.status(400).json({message: "No product found"});
        else return res.status(200).json(product);
    } 
    catch (error) {
        console.error("Error getting product: ", error);
        res.status(500).json( {message: "Can't get product"} );
    }
}

// GET /api/product/user/:id
export const getBoughtByUserId = async (req, res) => {
    try{
        const { id:u_i } = req.params;

        const products = await Product.find({bidder_id: u_i});

        if (products.length == 0) return res.status(400).json({message: "No product found"});
        else return res.status(200).json(products);
    } 
    catch (error) {
        console.error("Error getting product: ", error);
        res.status(500).json( {message: "Can't get product"} );
    }
}

// GET /api/product/category/:id
export const getProductByCategoryId = async (req, res) => {
    try{
        const { id:p_i } = req.params;

        const category = await Category.findById(p_i);

        if (!category) return res.status(400).json({message: "No category found"});

        let products = [];

        if(category.category_id == null){
            const sub_categories = await Category.find({category_id: category._id})

            const product_promises = sub_categories.map((c) => 
                Product.find({ category_id: c._id })
            );

            const results = await Promise.all(product_promises);

            products = results.flat();
        }
        else {
            products= await Product.find({category_id: category._id});
        }
            
        return res.status(200).json(products);
    } 
    catch (error) {
        console.error("Error getting product: ", error);
        res.status(500).json( {message: "Can't get product"} );
    }
}

// GET /api/product/:id/seller
export const getProductBySellerId = async (req, res) => {
    try{
        const { id:p_i } = req.params;

        // Check if seller id is valid
        const seller = await User.findById( p_i );
        if(!seller)
            return res.status(400).json ({message: "No user with that id"});
        if (seller.role !== "seller")
            return res.status(403).json({ message: "User is not a seller" });
    

        const product = await Product.find({seller_id: p_i});
        
        if (product.length == 0)
            return res.status(400).json({message: "No product found"});
        
        return res.status(200).json(product);
    } 
    catch (error) {
        console.error("Error getting seller's product: ", error);
        res.status(500).json( {message: "Can't get seller's product"} );
    }
}

// PATCH /api/product/:id
export const changeProductById = async (req, res) => {
  try {
    const { id:p_i } = req.params;

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
export const deleteProductById = async (req,res) => {
    try{
        const { id:p_i } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(p_i);

        if (!deletedProduct) 
            return res.status(404).json({ message: `No product found with id: ${p_i}` });

        res.status(200).json({ message: `Deleted product: ${deletedProduct.name}` });
    } 
    catch (error) {
        console.error("Error deleting product: ", error);
        res.status(500).json( {message: "Can't delete product"} );
    }
}

// GET /api/product/top5/ending
export const getTop5Ending = async (req, res) => {
    try{
        const now = new Date();
        const products = await Product.find({
            status: "active",
            end_time: { $exists: true, $gt: new Date() }
        }).sort({ end_time: 1 }).limit(5);
        return res.status(200).json(products);
    }
    catch (error){
        console.error("Error getting top 5 ending: ", error);
        res.status(500).json( {message: "Can't get top 5 ending"} );
    }
}

// GET /api/product/top5/bid
export const getTop5Bid = async (req, res) => {
    try{
        let products = await Product.find( {
            status: "active",
            total_bids: { $exists: true }
        } ).sort({total_bids: -1}).limit(5);
        return res.status(200).json(products);
    }
    catch (error){
        console.error("Error getting top 5 most bids: ", error);
        res.status(500).json( {message: "Can't get top 5 most bids"} );
    }
}

// GET /api/product/top5/price
export const getTop5Price = async (req, res) => {
    try{
        let products = await Product.find({status: "active", current_price: { $exists: true }}).sort({current_price: -1}).limit(5);
        return res.status(200).json(products);
    }
    catch (error){
        console.error("Error getting top 5 most price: ", error);
        res.status(500).json( {message: "Can't get top 5 most price"} );
    }
}