import mongoose from "mongoose";

const RatingSchema = mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            refer: "Product",
        },

        from_user_id: {
            type: mongoose.Schema.Types.ObjectId,
            refer: "User",
        },

        to_user_id: {
            type: mongoose.Schema.Types.ObjectId,
            refer: "User",
        },

        points: {
            type: Number,
        }, 

        comment: {
            type: String,
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Rating", RatingSchema);