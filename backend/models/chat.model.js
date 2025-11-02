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
        Timestamp: {
            createdAt: true,
            updatedAt: false
        }
    }
);

export default mongoose.model("Chat", ChatSchema);