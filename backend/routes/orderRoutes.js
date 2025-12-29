import express from "express";
import {
  createOrderSchema,
  updateOrderSchema,
  orderIdParamSchema,
  productIdParamSchema,
  userIdParamSchema,
  sendOrderMessageSchema,
} from "../schemas/OrderSchema.js";
import {
  createOrder,
  getAllOrders,
  getOrdersByUser,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrderByProductId,
  sendMessage,
  getMessages,
} from "../controllers/orderController.js";
import {
  authenticate,
  isAdmin,
  isOwner,
  validateOrderData,
} from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();
router.get(
  "/product/:product_id",
  authenticate,
  validate({ params: productIdParamSchema }),
  getOrderByProductId
);

// CREATE
// POST /api/orders
// Protected: Any authenticated user can create order
router.post(
  "/",
  authenticate,
  validate({ body: createOrderSchema }),
  createOrder
);

// READ
// GET /api/orders
// Protected: Admin only - get all orders
router.get("/", authenticate, isAdmin, getAllOrders);

// GET /api/orders/user/:user_id?role=buyer
// Protected: Get orders for specific user (as buyer or seller)
router.get(
  "/user/:user_id",
  authenticate,
  validate({ params: userIdParamSchema }),
  getOrdersByUser
);

// GET /api/orders/:id
// Protected: Only order owner (buyer/seller) or admin
router.get(
  "/:id",
  authenticate,
  validate({ params: orderIdParamSchema }),
  isOwner("order"),
  getOrderById
);

router.get(
  "/:id/messages",
  authenticate,
  validate({ params: orderIdParamSchema }),
  getMessages
);

router.post(
  "/:id/messages",
  authenticate,
  validate({ params: orderIdParamSchema, body: sendOrderMessageSchema }),
  sendMessage
);

// UPDATE
// PUT /api/orders/:id
// Protected: Only order owner or admin can update
// router.put("/:id", authenticate, isOwner("order"), updateOrder);
router.put(
  "/:id",
  authenticate,
  validate({ params: orderIdParamSchema, body: updateOrderSchema }),
  updateOrder
);

// DELETE
// DELETE /api/orders/:id
// Protected: Admin only
router.delete(
  "/:id",
  authenticate,
  validate({ params: orderIdParamSchema }),
  isAdmin,
  deleteOrder
);

export default router;
