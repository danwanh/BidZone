import mongoose from "mongoose";

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description_history: [
      {
        description: { type: String },
        updated_at: { type: Date, default: Date.now }
      }
    ],

    category_id: {
      // category con
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    start_price: {
      type: Number,
      required: true,
    },

    bid_step: {
      type: Number,
    },

    buy_now_price: {
      type: Number,
    },

    current_price: {
      type: Number,
      required: true
    },

    start_time: {
      type: Date,
      default: Date.now,
    },

    end_time: {
      type: Date,
      required: true
    },

    bidder_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    is_autobid: {
      type: Boolean,
      default: false,
    },

    image_url: {
      type: [String],
    },

    status: {
      type: String,
      enum: ["active", "ended", "cancelled", "sold"],
    },

    total_bids: {
      type: Number,
      default: 0,
    },

    banned_bidders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    allow_unrated_bidders: {
      type: Boolean,
    },

    slug: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.index(
  {
    name: "text",
    "description_history.description": "text",
  },
  {
    weights: {
      name: 10,
      "description_history.description": 3,
    },
    name: "ProductTextIndex",
  }
);



export default mongoose.model("Product", ProductSchema);
