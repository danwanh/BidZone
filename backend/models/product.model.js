import mongoose from "mongoose";

const ProductSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        description: {
            type: String
        },

        category_id: { // category con
            type: mongoose.Schema.Types.ObjectId, ref: "Category" 
        },

        seller_id: {
            type: mongoose.Schema.Types.ObjectId, ref: "User",
            required: true
        },

        start_price: {
            type: Number,
            required: true
        },

        bid_step: {
            type: Number,
        },

        buy_now_price: {
            type: Number
        },

        current_price: {
            type: Number
        },

        start_time: {
            type: Date,
            default: Date.now,
        },

        end_time: {
            type: Date,
        },

        bidder_id: {
            type: mongoose.Schema.Types.ObjectId, refer: "User",
        },

        is_autobid: {
            type: Boolean,
            default: false
        },

        image_url: {
            type: [String],
        },

        status: {
            type: String,
            enum: ["active", "ended", "cancelled"],
        },

        total_bids: {
            type: Number
        },

        banned_bidders: [{
            type: mongoose.Schema.Types.ObjectId,
            refer: "User"
        }],

        allow_unrated_bidders: {
            type: Boolean
        },

        slug: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Product", ProductSchema);