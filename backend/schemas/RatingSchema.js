import Joi from "joi";
import { idSchema } from "./IdSchema.js";

// Validation for the Rating ID parameter
export const ratingIdParamSchema = Joi.object({
  id: idSchema.required().messages({
    "any.required": "ID đánh giá là bắt buộc",
    "any.invalid": "ID đánh giá không hợp lệ",
  }),
});

export const ratingUserIdParamSchema = Joi.object({
  userId: idSchema.required().messages({
    "any.required": "ID người dùng là bắt buộc",
    "any.invalid": "ID người dùng không hợp lệ",
  }),
});

// Validation for the Rating body
export const ratingBodySchema = Joi.object({
  product_id: idSchema.required().messages({
    "any.required": "ID sản phẩm là bắt buộc",
    "any.invalid": "ID sản phẩm không hợp lệ",
  }),
  from_user_id: idSchema.required().messages({
    "any.required": "ID người đánh giá là bắt buộc",
    "any.invalid": "ID người đánh giá không hợp lệ",
  }),
  to_user_id: idSchema.required().messages({
    "any.required": "ID người được đánh giá là bắt buộc",
    "any.invalid": "ID người được đánh giá không hợp lệ",
  }),
  points: Joi.number().valid(1, -1).required().messages({
    "any.required": "Điểm đánh giá là bắt buộc",
    "any.only": "Điểm đánh giá phải là 1 hoặc -1",
  }),
  comment: Joi.string().required().messages({
    "any.required": "Cần phải có nhận xét khi đánh giá",
  }),
});
