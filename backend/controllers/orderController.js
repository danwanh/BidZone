import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";

// CREATE - Create new order (when auction ends)
export const createOrder = async (req, res) => {
  try {
    const { product_id, seller_id, buyer_id } = req.body;

    if (!product_id || !seller_id || !buyer_id) {
      return res.status(400).json({
        message: "Thiếu product_id, seller_id hoặc buyer_id"
      });
    }

    const order = new Order({
      product_id,
      seller_id,
      buyer_id
    });

    await order.save();

    res.status(201).json({
      message: "Tạo order thành công",
      order
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi tạo order",
      error: error.message
    });
  }
};

export const getOrdersByProductId = async (req, res) => {
  try {
    const { product_id } = req.params;

    const orders = await Order.find({ product_id })
      .populate("product_id")
      .populate("seller_id", "name email")
      .populate("buyer_id", "name email");

    if (orders.length === 0) {
      return res.status(404).json({
        message: "Không có order nào cho product này"
      });
    }

    res.status(200).json({
      orders
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi lấy order",
      error: error.message
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
                $or: [{ buyer_id: user_id }, { seller_id: user_id }]
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
        const { status, invoice_info, shipping_info, address } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Validate status transitions
        const validStatuses = ["unpaid", "paid", "received", "delivered", "completed", "cancelled"];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        // Update fields
        if (status) order.status = status;
        if (invoice_info) order.invoice_info = invoice_info;
        if (shipping_info) order.shipping_info = shipping_info;
        if (address) order.address = address;

        await order.save();
        res.json({ message: "Order updated", order });
    } catch (err) {
        console.error("Error updating order:", err);
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
