import Joi from "joi";
import { idSchema } from "./IdSchema.js";

export const bidIdParamSchema = Joi.object({
  id: idSchema.required().messages({
    "any.required": "Bid ID is required",
    "any.invalid": "Invalid Bid ID",
  }),
});

export const bidProductIdParamSchema = Joi.object({
  product_id: idSchema.required().messages({
    "any.required": "Bid ID is required",
    "any.invalid": "Invalid Bid ID",
  }),
});

// For creating a new Bid
export const createBidSchema = Joi.object({
  product_id: idSchema.required().messages({
    "any.required": "Product ID is required",
    "any.invalid": "Invalid Product ID",
  }),
  bidder_id: idSchema.required().messages({
    "any.required": "Bidder ID is required",
    "any.invalid": "Invalid Bidder ID",
  }),
  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be positive",
    "any.required": "Price is required",
  }),
});

// For updating Bid status
export const updateBidStatusSchema = Joi.object({
  status: Joi.boolean().required().messages({
    "boolean.base": "Status must be true or false",
    "any.required": "Status is required",
  }),
});