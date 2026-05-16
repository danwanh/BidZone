import * as orderService from "../services/orderService.js";

// CREATE - Create new order (when auction ends)
export const createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.validated.body);
    res.status(201).json({
      message: "Tạo order thành công",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi tạo order",
      error: error.message,
    });
  }
};

export const getOrderByProductId = async (req, res) => {
  try {
    const order = await orderService.getOrderByProductId(req.validated.params.product_id);
    res.status(200).json(order);
  } catch (error) {
    res.status(error.message === "Không có order cho product này" ? 404 : 500).json({
      message: error.message,
    });
  }
};

// READ - Get all orders (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (err) {
    console.error("Error getting all orders:", err);
    res.status(500).json({ message: err.message });
  }
};

// READ - Get orders by user (as buyer or seller)
export const getOrdersByUser = async (req, res) => {
  try {
    const { user_id } = req.validated.params;
    const { role } = req.validated.query;
    const orders = await orderService.getOrdersByUser(user_id, role);
    res.json(orders);
  } catch (err) {
    console.error("Error getting user orders:", err);
    res.status(500).json({ message: err.message });
  }
};

// READ - Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.validated.params.id);
    res.json(order);
  } catch (err) {
    console.error("Error getting order:", err);
    res.status(err.message === "Order not found" ? 404 : 500).json({ message: err.message });
  }
};

// UPDATE - Update order status and info
export const updateOrder = async (req, res) => {
  try {
    const order = await orderService.updateOrder(req.validated.params.id, req.validated.body);
    res.json({ message: "Order updated", order });
  } catch (err) {
    res.status(err.message === "Order not found" ? 404 : err.message === "Invalid status" ? 400 : 500).json({ message: err.message });
  }
};

// DELETE - Delete order (Admin only)
export const deleteOrder = async (req, res) => {
  try {
    await orderService.deleteOrder(req.validated.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(err.message === "Order not found" ? 404 : 500).json({ message: err.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const message = await orderService.sendMessage(req.validated.params.id, req.user._id, req.validated.body.content);
    res.status(201).json({
      message: "Message sent",
      data: message,
    });
  } catch (err) {
    console.error(err);
    const status = err.message === "Order not found" ? 404 : err.message === "Not allowed to chat" ? 403 : 500;
    res.status(status).json({ message: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await orderService.getMessages(req.validated.params.id, req.user._id);
    res.json(messages);
  } catch (err) {
    const status = err.message === "Order not found" ? 404 : err.message === "Not allowed" ? 403 : 500;
    res.status(status).json({ message: err.message });
  }
};
