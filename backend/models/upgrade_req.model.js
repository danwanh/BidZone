import mongoose from "mongoose";

const UpgradeRequestSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["pending", "rejected", "accepted"],
      default: "pending",
    },

    note: {
      type: String,
    },

    name: {
      type: String,
    },

    email: {
      type: String,
    },

    phone_number: {
      type: String,
    },

    address: {
      type: String,
    },

    city: {
      type: String,
    },

    province: {
      type: String,
    },

    postal: {
      type: String,
    },

    country: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("UpgradeRequest", UpgradeRequestSchema);
