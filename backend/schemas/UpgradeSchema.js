import Joi from "joi";
import { idSchema } from "./IdSchema.js"; // Assuming you already have this schema for ObjectId validation

// Validation for creating or updating an upgrade request
export const upgradeRequestBodySchema = Joi.object({
  user_id: idSchema.required().messages({
    "any.required": "User ID is required",
    "any.invalid": "Invalid User ID format",
  }),
  note: Joi.string().optional(),
  first_name: Joi.string().min(2).max(100).optional(),
  last_name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  phone_number: Joi.string().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  province: Joi.string().optional(),
  postal: Joi.string().optional(),
  country: Joi.string().optional(),
});

// Validation for the upgrade request ID parameter
export const upgradeRequestIdParamSchema = Joi.object({
  id: idSchema.required().messages({
    "any.required": "Upgrade Request ID is required",
    "any.invalid": "Invalid Upgrade Request ID format",
  }),
});
