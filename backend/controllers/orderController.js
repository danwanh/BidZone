import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";

// CREATE - Create new order (when auction ends)
export const createOrder = async (req, res) => {
  try {
    const { product_id, seller_id, buyer_id } = req.body;

    if (!product_id || !seller_id || !buyer_id) {
      return res.status(400).json({
        message: "Thiếu product_id, seller_id hoặc buyer_id",
      });
    }

    const order = new Order({
      product_id,
      seller_id,
      buyer_id,
    });

    await order.save();

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
    const { product_id } = req.params;

    const order = await Order.findOne({ product_id })
      .populate("product_id")
      .populate("seller_id", "name email")
      .populate("buyer_id", "name email");

    if (!order) {
      return res.status(404).json({
        message: "Không có order cho product này",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi lấy order",
      error: error.message,
    });
  }
};

// export const createOrder = async (req, res) => {
//     try {
//         const { product_id, seller_id, buyer_id, address } = req.body;

//         // Validate ObjectIds
//         if (!mongoose.Types.ObjectId.isValid(product_id)) {
//             return res.status(400).json({ message: "Invalid product_id" });
//         }
//         if (!mongoose.Types.ObjectId.isValid(seller_id)) {
//             return res.status(400).json({ message: "Invalid seller_id" });
//         }
//         if (!mongoose.Types.ObjectId.isValid(buyer_id)) {
//             return res.status(400).json({ message: "Invalid buyer_id" });
//         }

//         // Check if product exists and auction ended
//         const product = await Product.findById(product_id);
//         if (!product) {
//             return res.status(404).json({ message: "Product not found" });
//         }
//         if (product.status !== "ended") {
//             return res.status(400).json({ message: "Auction is still active" });
//         }

//         // Check if order already exists for this product
//         const existingOrder = await Order.findOne({ product_id });
//         if (existingOrder) {
//             return res.status(400).json({ message: "Order already exists for this product" });
//         }

//         const newOrder = new Order({
//             product_id,
//             seller_id,
//             buyer_id,
//             address,
//             status: "unpaid"
//         });

//         await newOrder.save();
//         res.status(201).json({ message: "Order created", order: newOrder });
//     } catch (err) {
//         console.error("Error creating order:", err);
//         res.status(500).json({ message: err.message });
//     }
// };

// READ - Get all orders (Admin only, or filter by user)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("product_id", "name image_url")
      .populate("seller_id", "name email")
      .populate("buyer_id", "name email");

    res.json(orders);
  } catch (err) {
    console.error("Error getting all orders:", err);
    res.status(500).json({ message: err.message });
  }
};

// READ - Get orders by user (as buyer or seller)
export const getOrdersByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { role } = req.query; // "buyer" or "seller"

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ message: "Invalid user_id" });
    }

    let query = {};
    if (role === "buyer") {
      query.buyer_id = user_id;
    } else if (role === "seller") {
      query.seller_id = user_id;
    } else {
      // Get both buyer and seller orders
      query = {
        $or: [{ buyer_id: user_id }, { seller_id: user_id }],
      };
    }

    const orders = await Order.find(query)
      .populate("product_id", "name image_url current_price")
      .populate("seller_id", "name email")
      .populate("buyer_id", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Error getting user orders:", err);
    res.status(500).json({ message: err.message });
  }
};

// READ - Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(id)
      .populate("product_id")
      .populate("seller_id", "name email phone")
      .populate("buyer_id", "name email phone");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("Error getting order:", err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE - Update order status and info
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const updateData = {};
    const allowedFields = [
      "status",
      "invoice_info",
      "delivery_info",
      "address",
      "cancellation_reason",
      "cancelled_by"
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (updateData.status) {
      const validStatuses = [
        "pending_payment",
        "pending_shipping",
        "pending_delivery",
        "completed",
        "cancelled",
      ];
      if (!validStatuses.includes(updateData.status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order updated", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// DELETE - Delete order (Admin only)
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ message: err.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user._id; // lấy từ JWT middleware

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Message content is required" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // chỉ buyer hoặc seller được chat
    if (
      !order.buyer_id.equals(userId) &&
      !order.seller_id.equals(userId)
    ) {
      return res.status(403).json({ message: "Not allowed to chat" });
    }

    order.messages.push({
      sender: userId,
      content,
    });

    await order.save();

    res.status(201).json({
      message: "Message sent",
      data: order.messages[order.messages.length - 1],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(id)
      .populate("messages.sender", "name")
      .select("messages buyer_id seller_id");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      !order.buyer_id.equals(userId) &&
      !order.seller_id.equals(userId)
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    res.json(order.messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
