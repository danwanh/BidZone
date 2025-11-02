import mongoose from "mongoose";

const QuestionSchema = mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            refer: "Product"
        },

        seller_id: {
            type: mongoose.Schema.Types,
            refer: "User"
        },

        bidder_id: {
            type: mongoose.Schema.Types,
            refer: "User"
        },

        question: {
            type: String,
        },

        answer: {
            type: String,
        }
    }
);

export default mongoose.model("Question", QuestionSchema);