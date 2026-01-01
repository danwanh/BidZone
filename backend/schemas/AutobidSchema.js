import Joi from "joi";
import { idSchema } from "./IdSchema.js";

// For routes that only need an ID in params
export const idParamSchema = Joi.object({
  id: idSchema.required().messages({
    "any.required": "AutoBid ID is required",
    "any.invalid": "Invalid AutoBid ID",
  })
});

// For creating a new AutoBid
export const createAutoBidSchema = Joi.object({
  product_id: idSchema.required().messages({
    "any.required": "Product ID is required",
    "any.invalid": "Invalid Product ID",
  }),
  bidder_id: idSchema.required().messages({
    "any.required": "Bidder ID is required",
    "any.invalid": "Invalid Bidder ID",
  }),
  max_price: Joi.number().positive().required().messages({
    "number.base": "Max price must be a number",
    "number.positive": "Max price must be positive",
    "any.required": "Max price is required",
  }),
});

// For updating bid status
export const updateBidStatusSchema = Joi.object({
  status: Joi.boolean().required().messages({
    "boolean.base": "Status must be true or false",
    "any.required": "Status is required",
  }),
});
