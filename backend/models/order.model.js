import mongoose from "mongoose";

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

    address: {
      type: String,
    },

    invoice_info: {
      type: String,
    },

    delivery_info: {
      type: String,
    },

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
      cancellation_reason:{
        type: String,
      },
      cancelled_by:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", OrderSchema);
