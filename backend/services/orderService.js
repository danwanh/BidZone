import Order from "../models/orderModel.js";

export const createOrder = async (orderData) => {
  const { product_id, seller_id, buyer_id } = orderData;
  const order = new Order({ product_id, seller_id, buyer_id });
  return await order.save();
};

export const getOrderByProductId = async (product_id) => {
  const order = await Order.findOne({ product_id })
    .populate("product_id")
    .populate("seller_id", "name email")
    .populate("buyer_id", "name email");
  if (!order) throw new Error("Không có order cho product này");
  return order;
};

export const getAllOrders = async () => {
  return await Order.find()
    .populate("product_id", "name image_url")
    .populate("seller_id", "name email")
    .populate("buyer_id", "name email");
};

export const getOrdersByUser = async (user_id, role) => {
  let query = {};
  if (role === "buyer") {
    query.buyer_id = user_id;
  } else if (role === "seller") {
    query.seller_id = user_id;
  } else {
    query = { $or: [{ buyer_id: user_id }, { seller_id: user_id }] };
  }

  return await Order.find(query)
    .populate("product_id", "name image_url current_price")
    .populate("seller_id", "name email")
    .populate("buyer_id", "name email")
    .sort({ createdAt: -1 });
};

export const getOrderById = async (id) => {
  const order = await Order.findById(id)
    .populate("product_id")
    .populate("seller_id", "name email phone")
    .populate("buyer_id", "name email phone");
  if (!order) throw new Error("Order not found");
  return order;
};

export const updateOrder = async (id, updateData) => {
  const allowedFields = [
    "status", "invoice_info", "delivery_info", "address",
    "cancellation_reason", "cancelled_by",
  ];

  const dataToUpdate = {};
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      dataToUpdate[field] = updateData[field];
    }
  });

  if (dataToUpdate.status) {
    const validStatuses = [
      "pending_payment", "pending_shipping", "pending_delivery", "completed", "cancelled",
    ];
    if (!validStatuses.includes(dataToUpdate.status)) {
      throw new Error("Invalid status");
    }
  }

  const order = await Order.findByIdAndUpdate(id, { $set: dataToUpdate }, { new: true });
  if (!order) throw new Error("Order not found");
  return order;
};

export const deleteOrder = async (id) => {
  const order = await Order.findByIdAndDelete(id);
  if (!order) throw new Error("Order not found");
  return order;
};

export const sendMessage = async (orderId, userId, content) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  if (!order.buyer_id.equals(userId) && !order.seller_id.equals(userId)) {
    throw new Error("Not allowed to chat");
  }

  const newMessage = {
    sender: userId,
    content: content.trim(),
    createdAt: new Date(),
  };

  order.messages.push(newMessage);
  await order.save();
  return newMessage;
};

export const getMessages = async (orderId, userId) => {
  const order = await Order.findById(orderId)
    .populate("messages.sender", "name")
    .select("messages buyer_id seller_id");

  if (!order) throw new Error("Order not found");
  if (!order.buyer_id.equals(userId) && !order.seller_id.equals(userId)) {
    throw new Error("Not allowed");
  }

  return order.messages;
};
