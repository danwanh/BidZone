import mongoose from "mongoose";

const DescriptionItemSchema = mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId, ref: "Product"
        },

        description: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("DescriptionItem", DescriptionItemSchema);