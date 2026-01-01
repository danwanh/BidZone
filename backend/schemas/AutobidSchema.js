import Joi from "joi";
import { idSchema } from "./IdSchema.js";

// For routes that only need an ID in params
export const idParamSchema = Joi.object({
  id: idSchema.required().messages({
    "any.required": "AutoBid ID là bắt buộc",
    "any.invalid": "AutoBid ID không hợp lệ",
  }),
});

// For creating a new AutoBid
export const createAutoBidSchema = Joi.object({
  product_id: idSchema.required().messages({
    "any.required": "Product ID là bắt buộc",
    "any.invalid": "Product ID không hợp lệ",
  }),
  bidder_id: idSchema.required().messages({
    "any.required": "Bidder ID là bắt buộc",
    "any.invalid": "Bidder ID không hợp lệ",
  }),
  max_price: Joi.number().positive().required().messages({
    "number.base": "Giá tối đa phải là số",
    "number.positive": "Giá tối đa phải là số dương",
    "any.required": "Giá tối đa là bắt buộc",
  }),
});

// For updating bid status
export const updateBidStatusSchema = Joi.object({
  status: Joi.boolean().required().messages({
    "boolean.base": "Trạng thái phải là true hoặc false",
    "any.required": "Trạng thái là bắt buộc",
  }),
});
