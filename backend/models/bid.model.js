import mongoose from "mongoose";

const BidSchema = mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId, ref: "Product",
            required: true
        },

        bidder_id: {
            type: mongoose.Schema.Types.ObjectId, ref: "User",
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        date: {
            type: Date,
            default: Date.now
        }
    }
);

export default mongoose.model("Bid", BidSchema);