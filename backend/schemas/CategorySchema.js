import Joi from "joi";
import { idSchema } from "./IdSchema.js";

// dùng cho :categoryId
export const categoryIdParamSchema = Joi.object({
  categoryId: idSchema.required().messages({
    "any.required": "Category ID is required",
    "any.invalid": "Invalid Category ID",
  }),
});

// POST /api/category
export const createCategorySchema = Joi.object({
  category_id: idSchema.allow(null, "").messages({
    "any.invalid": "Invalid parent category ID",
  }),

  name: Joi.string().trim().min(1).required().messages({
    "string.base": "Category name must be a string",
    "string.empty": "Category name cannot be empty",
    "any.required": "Category name is required",
  }),

  slug: Joi.string().trim().optional().messages({
    "string.base": "Slug must be a string",
  }),
});

// PATCH /api/category/:categoryId
export const updateCategorySchema = Joi.object({
  category_id: idSchema.allow(null).messages({
    "any.invalid": "Invalid parent category ID",
  }),

  name: Joi.string().trim().min(1).messages({
    "string.base": "Category name must be a string",
    "string.empty": "Category name cannot be empty",
  }),

  slug: Joi.string().trim().messages({
    "string.base": "Slug must be a string",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be updated",
  });
