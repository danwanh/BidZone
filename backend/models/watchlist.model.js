import mongoose from "mongoose";

const WatchListSchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            refer: "User",
        },

        product_id: [{
            type: mongoose.Schema.Types.ObjectId,
            refer: "Product",
        }],

    }
);

export default mongoose.model("WatchList", WatchlistSchema);