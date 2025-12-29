import Joi from "joi";
import { idSchema } from "./IdSchema.js";

// /chat/:id
export const messageIdParamSchema = Joi.object({
  id: idSchema.required().messages({
    "any.required": "Message ID is required",
    "any.invalid": "Invalid Message ID",
  }),
});

// /chat/:seller_id/:user_id
export const conversationParamSchema = Joi.object({
  seller_id: idSchema.required().messages({
    "any.required": "Seller ID is required",
    "any.invalid": "Invalid Seller ID",
  }),
  user_id: idSchema.required().messages({
    "any.required": "User ID is required",
    "any.invalid": "Invalid User ID",
  }),
});

// /chat/user/:user_id
export const userIdParamSchema = Joi.object({
  user_id: idSchema.required().messages({
    "any.required": "User ID is required",
    "any.invalid": "Invalid User ID",
  }),
});


// POST /chat
export const createMessageSchema = Joi.object({
  seller_id: idSchema.required().messages({
    "any.required": "Seller ID is required",
    "any.invalid": "Invalid Seller ID",
  }),

  user_id: idSchema.required().messages({
    "any.required": "User ID is required",
    "any.invalid": "Invalid User ID",
  }),

  content: Joi.string().trim().min(1).required().messages({
    "string.base": "Message content must be a string",
    "string.empty": "Message content cannot be empty",
    "any.required": "Message content is required",
  }),
});

// PATCH /chat/:id
export const updateMessageSchema = Joi.object({
  content: Joi.string().trim().min(1).required().messages({
    "string.base": "Message content must be a string",
    "string.empty": "Message content cannot be empty",
    "any.required": "Message content is required",
  }),
});
