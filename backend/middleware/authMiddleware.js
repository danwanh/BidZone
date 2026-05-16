import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Verify JWT token and attach user to request
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    // Find user
    const user = await User.findById(decoded.id).select("-password_hash");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Check if user is admin
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

// Check if user is seller
export const isSeller = (req, res, next) => {
  if (req.user.role !== "seller" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Sellers only." });
  }
  next();
};

// Check if user owns the resource (for orders, etc.)
export const isOwner = (resourceType) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      let resource;

      // Import the appropriate model based on resourceType
      if (resourceType === "order") {
        const Order = (await import("../models/orderModel.js")).default;
        resource = await Order.findById(resourceId);

        // Check if user is buyer or seller of this order
        if (!resource) {
          return res.status(404).json({ message: "Order not found" });
        }

        const isBuyer =
          resource.buyer_id.toString() === req.user._id.toString();
        const isSeller =
          resource.seller_id.toString() === req.user._id.toString();

        if (!isBuyer && !isSeller && req.user.role !== "admin") {
          return res.status(403).json({ message: "Access denied" });
        }
      }

      next();
    } catch (err) {
      console.error("Authorization error:", err);
      res.status(500).json({ message: err.message });
    }
  };
};

// Validate request body
export const validateOrderData = (req, res, next) => {
  const { product_id, seller_id, buyer_id, address } = req.body;

  if (!product_id || !seller_id || !buyer_id || !address) {
    return res.status(400).json({
      message:
        "Missing required fields: product_id, seller_id, buyer_id, address",
    });
  }

  next();
};


