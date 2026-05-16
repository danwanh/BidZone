import Joi from "joi";
import { idSchema } from "./IdSchema.js";

export const bidIdParamSchema = Joi.object({
  id: idSchema.required().messages({
    "any.required": "Bid ID là bắt buộc",
    "any.invalid": "Bid ID không hợp lệ",
  }),
});

export const bidProductIdParamSchema = Joi.object({
  product_id: idSchema.required().messages({
    "any.required": "Product ID là bắt buộc",
    "any.invalid": "Product ID không hợp lệ",
  }),
});

// For creating a new Bid
export const createBidSchema = Joi.object({
  product_id: idSchema.required().messages({
    "any.required": "Product ID là bắt buộc",
    "any.invalid": "Product ID không hợp lệ",
  }),
  bidder_id: idSchema.required().messages({
    "any.required": "Bidder ID là bắt buộc",
    "any.invalid": "Bidder ID không hợp lệ",
  }),
  price: Joi.number().positive().required().messages({
    "number.base": "Giá phải là số",
    "number.positive": "Giá phải là số dương",
    "any.required": "Giá là bắt buộc",
  }),
});

// For updating Bid status
export const updateBidStatusSchema = Joi.object({
  status: Joi.boolean().required().messages({
    "boolean.base": "Trạng thái phải là true hoặc false",
    "any.required": "Trạng thái là bắt buộc",
  }),
});


