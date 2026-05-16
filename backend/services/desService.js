import Description from "../models/descriptionListModel.js";
import Product from "../models/productModel.js";

export const getAllDescriptions = async () => {
  return await Description.find();
};

export const getDescriptionById = async (id) => {
  const description = await Description.findById(id);
  if (!description) throw new Error("Can't find description");
  return description;
};

export const createDescription = async (descData) => {
  const { product_id, description } = descData;
  const product = await Product.findById(product_id);
  if (!product) throw new Error("Product not found");

  const newDescription = new Description({ product_id, description });
  return await newDescription.save();
};

export const updateDescription = async (id, updateData) => {
  const { product_id, description } = updateData;
  const desc = await Description.findById(id);
  if (!desc) throw new Error("Can't find description");

  if (product_id) desc.product_id = product_id;
  if (description) desc.description = description;

  return await Description.findByIdAndUpdate(id, desc, { new: true });
};

export const deleteDescription = async (id) => {
  const deleted = await Description.findByIdAndDelete(id);
  if (!deleted) throw new Error("Failed to delete description");
  return deleted;
};
