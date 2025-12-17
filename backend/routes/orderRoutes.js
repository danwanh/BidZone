import express from "express";
import {
    createOrder,
    getAllOrders,
    getOrdersByUser,
    getOrderById,
    updateOrder,
    deleteOrder, getOrderByProductId 
} from "../controllers/orderController.js";
import { 
    authenticate, 
    isAdmin, 
    isOwner,
    validateOrderData 
} from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/product/:product_id", getOrderByProductId);

// CREATE
// POST /api/orders
// Protected: Any authenticated user can create order
router.post("/", createOrder);

// READ
// GET /api/orders
// Protected: Admin only - get all orders
router.get("/", authenticate, isAdmin, getAllOrders);

// GET /api/orders/user/:user_id?role=buyer
// Protected: Get orders for specific user (as buyer or seller)
router.get("/user/:user_id", authenticate, getOrdersByUser);

// GET /api/orders/:id
// Protected: Only order owner (buyer/seller) or admin
router.get("/:id", authenticate, isOwner("order"), getOrderById);

// UPDATE
// PUT /api/orders/:id
// Protected: Only order owner or admin can update
// router.put("/:id", authenticate, isOwner("order"), updateOrder);
router.put("/:id", updateOrder);
// DELETE
// DELETE /api/orders/:id
// Protected: Admin only
router.delete("/:id", authenticate, isAdmin, deleteOrder);

export default router;
