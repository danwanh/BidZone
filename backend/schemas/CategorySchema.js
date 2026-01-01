import Joi from "joi";
import { idSchema } from "./IdSchema.js";

// dùng cho :categoryId
export const categoryIdParamSchema = Joi.object({
  categoryId: idSchema.required().messages({
    "any.required": "Category ID là bắt buộc",
    "any.invalid": "Category ID không hợp lệ",
  }),
});

// POST /api/category
export const createCategorySchema = Joi.object({
  category_id: idSchema.allow(null, "").messages({
    "any.invalid": "ID danh mục cha không hợp lệ",
  }),

  name: Joi.string().trim().min(1).required().messages({
    "string.base": "Tên danh mục phải là chuỗi",
    "string.empty": "Tên danh mục không được để trống",
    "any.required": "Tên danh mục là bắt buộc",
  }),

  slug: Joi.string().trim().optional().messages({
    "string.base": "Slug phải là chuỗi",
  }),
});

// PATCH /api/category/:categoryId
export const updateCategorySchema = Joi.object({
  category_id: idSchema.allow(null).allow("").messages({
    "any.invalid": "ID danh mục cha không hợp lệ",
  }),

  name: Joi.string().trim().min(1).messages({
    "string.base": "Tên danh mục phải là chuỗi",
    "string.empty": "Tên danh mục không được để trống",
  }),

  slug: Joi.string().trim().messages({
    "string.base": "Slug phải là chuỗi",
  }),
})
  .min(1)
  .messages({
    "object.min": "Cần cập nhật ít nhất một trường",
  });
