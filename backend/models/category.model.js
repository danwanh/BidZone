import mongoose from "mongoose";

const CategorySchema = mongoose.Schema({
    category_id: { //parent_id
      type: mongoose.Schema.Types.ObjectId,
      ref:("Category")
    },

    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
    },
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Category", CategorySchema);
