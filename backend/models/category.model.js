import mongoose from "mongoose";

const CategorySchema = mongoose.Schema({
  category_id: {
    type: mongoose.Schema.Types.ObjectId("Category"),
  },

  name: {
    type: String,
    required: true,
  },

  slug: {
    type: String,
  },
});

export default mongoose.model("Category", CategorySchema);
