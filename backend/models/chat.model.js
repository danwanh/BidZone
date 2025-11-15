import mongoose from "mongoose";

const ChatSchema = mongoose.Schema(
    {
        seller_id: {
            type: mongoose.Schema.Types,
            refer: "User"
        },

        bidder_id: {
            type: mongoose.Schema.Types,
            refer: "User"
        },

        content: {
            type: String,
        }

    },
    {
        timestamps: true
    }
);

export default mongoose.model("Chat", ChatSchema);