import Joi from "joi";
import { idSchema } from "./IdSchema.js";

// /description/:id
export const descriptionIdParamSchema = Joi.object({
  id: idSchema.required().messages({
    "any.required": "Description ID là bắt buộc",
    "any.invalid": "Description ID không hợp lệ",
  }),
});

// POST /description
export const createDescriptionSchema = Joi.object({
  product_id: idSchema.required().messages({
    "any.required": "Product ID là bắt buộc",
    "any.invalid": "Product ID không hợp lệ",
  }),

  description: Joi.string().trim().min(1).required().messages({
    "string.base": "Mô tả phải là chuỗi",
    "string.empty": "Mô tả không được để trống",
    "any.required": "Mô tả là bắt buộc",
  }),
});

// PATCH /description/:id
export const updateDescriptionSchema = Joi.object({
  product_id: idSchema.messages({
    "any.invalid": "Product ID không hợp lệ",
  }),

  description: Joi.string().trim().min(1).messages({
    "string.base": "Mô tả phải là chuỗi",
    "string.empty": "Mô tả không được để trống",
  }),
}).min(1).messages({
  "object.min": "Cần cập nhật ít nhất một trường",
});

