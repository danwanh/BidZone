import Joi from "joi";
import { idSchema } from "./IdSchema.js";

// Validation schema for question routes
export const questionIdParamSchema = Joi.object({
  id: idSchema.required().messages({
    "any.required": "ID câu hỏi là bắt buộc",
    "any.invalid": "ID câu hỏi không hợp lệ",
  }),
});

export const questionProductIdParamSchema = Joi.object({
  product_id: idSchema.required().messages({
    "any.required": "ID câu hỏi là bắt buộc",
    "any.invalid": "ID câu hỏi không hợp lệ",
  }),
});

export const questionBodySchema = Joi.object({
  product_id: idSchema.optional().messages({
    "any.required": "ID sản phẩm là bắt buộc",
    "any.invalid": "ID sản phẩm không hợp lệ",
  }),
  seller_id: idSchema.optional().messages({
    "any.required": "ID người bán là bắt buộc",
    "any.invalid": "ID người bán không hợp lệ",
  }),
  bidder_id: idSchema.optional().messages({
    "any.required": "ID người mua là bắt buộc",
    "any.invalid": "ID người mua không hợp lệ",
  }),
  question: Joi.string().optional().messages({
    "any.required": "Câu hỏi là bắt buộc",
  }),
  answer: Joi.string().allow("").optional(),
});
