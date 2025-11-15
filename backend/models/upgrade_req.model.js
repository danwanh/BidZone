import mongoose from "mongoose";

const UpgradeRequestSchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types,
            refer: "User"
        },

        admin_id: {
            type: mongoose.Schema.Types,
            refer: "User"
        },

        status: {
            type: String,
            enum: ["pending", "rejected", "accepted"],
            default: "pending"
        }

    },
    {
        timestamps: true
    }
);

export default mongoose.model("UpgradeRequest", UpgradeRequestSchema);