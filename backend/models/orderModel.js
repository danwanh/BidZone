import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    // isRead: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  { timestamps: true }
);

const OrderSchema = mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    buyer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    address: String,
    invoice_info: String,
    delivery_info: String,

    status: {
      type: String,
      enum: [
        "pending_payment",
        "pending_shipping",
        "pending_delivery",
        "completed",
        "cancelled",
      ],
      default: "pending_payment",
    },

    cancellation_reason: String,
    cancelled_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    messages: [MessageSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", OrderSchema);


