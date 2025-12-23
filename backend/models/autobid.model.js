import mongoose from "mongoose";

const AutoBidSchema = mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId, ref: "Product",
            required: true
        },

        bidder_id: {
            type: mongoose.Schema.Types.ObjectId, ref: "User",
            required: true
        },

        price: { // giá vào sản phẩm
            type: Number,
        },

        max_price: { //người dùng nhập
            type: Number,
            required: true
        },

        current_holder: {
            type: mongoose.Schema.Types.ObjectId, ref: "User",
        }, 
        status: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("AutoBid", AutoBidSchema);