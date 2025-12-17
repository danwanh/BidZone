import mongoose from "mongoose";

const OrderSchema = mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        seller_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        buyer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        address: {
            type: String,
            required: true
        },

        invoice_info: {
            type: String
        },

        delivery_info: {
            type: String
        },

        status: {
            type: String,
            enum: ["unpaid", "paid", "pending", "delivered", "cancel"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Order", OrderSchema);