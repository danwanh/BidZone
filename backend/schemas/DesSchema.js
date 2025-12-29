import Joi from "joi";
import { idSchema } from "./IdSchema.js";

// /description/:id
export const descriptionIdParamSchema = Joi.object({
  id: idSchema.required().messages({
    "any.required": "Description ID is required",
    "any.invalid": "Invalid Description ID",
  }),
});

// POST /description
export const createDescriptionSchema = Joi.object({
  product_id: idSchema.required().messages({
    "any.required": "Product ID is required",
    "any.invalid": "Invalid Product ID",
  }),

  description: Joi.string().trim().min(1).required().messages({
    "string.base": "Description must be a string",
    "string.empty": "Description cannot be empty",
    "any.required": "Description is required",
  }),
});

// PATCH /description/:id
export const updateDescriptionSchema = Joi.object({
  product_id: idSchema.messages({
    "any.invalid": "Invalid Product ID",
  }),

  description: Joi.string().trim().min(1).messages({
    "string.base": "Description must be a string",
    "string.empty": "Description cannot be empty",
  }),
}).min(1).messages({
  "object.min": "At least one field must be updated",
});