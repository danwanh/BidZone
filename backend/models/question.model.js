import mongoose from "mongoose";

const QuestionSchema = mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            refer: "Product"
        },

        seller_id: {
            type: mongoose.Schema.Types.ObjectId,
            refer: "User"
        },

        bidder_id: {
            type: mongoose.Schema.Types.ObjectId,
            refer: "User"
        },

        question: {
            type: String,
        },

        answer: {
            type: String,
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Question", QuestionSchema);