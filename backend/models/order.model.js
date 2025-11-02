import mongoose from "mongoose";

const OrderSchema = mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            refer: "Product",
        },

        seller_id: {
            type: mongoose.Schema.Types.ObjectId,
            refer: "User",
        },

        buyer_id: {
            type: mongoose.Schema.Types.ObjectId,
            refer: "User",
        },

        address: {
            type: String,
        },

        invoice_info: {
            type: String
        },

        status: {
            type: String,
            enum: ["unpaid", "paid", "pending", "delivered", "cancel"],
            default: "pending"
        }
    }
);

export default mongoose.model("Order", OrderSchema);