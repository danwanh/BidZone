import mongoose from "mongoose";

const DescriptionItemSchema = mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId, ref: "Product"
        },

        description: {
            type: String
        },

        date: {
            type: Date,
            default: Date.now()
        }
    }
);

export default mongoose.model("DescriptionItem", DescriptionItemSchema);