import mongoose from "mongoose";

const WatchListSchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            refer: "User",
            required: true
        },

        product_id: [{
            type: mongoose.Schema.Types.ObjectId,
            refer: "Product",
        }],

    }, 
    {
        timestamps: true
    }
);

export default mongoose.model("WatchList", WatchListSchema);