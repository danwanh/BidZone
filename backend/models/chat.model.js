import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    bidder_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    content: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Chat", ChatSchema);
