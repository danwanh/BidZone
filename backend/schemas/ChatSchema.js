import Joi from "joi";
import { idSchema } from "./IdSchema.js";

// /chat/:id
export const messageIdParamSchema = Joi.object({
  id: idSchema.required().messages({
    "any.required": "Message ID là bắt buộc",
    "any.invalid": "Message ID không hợp lệ",
  }),
});

// /chat/:seller_id/:user_id
export const conversationParamSchema = Joi.object({
  seller_id: idSchema.required().messages({
    "any.required": "Seller ID là bắt buộc",
    "any.invalid": "Seller ID không hợp lệ",
  }),
  user_id: idSchema.required().messages({
    "any.required": "User ID là bắt buộc",
    "any.invalid": "User ID không hợp lệ",
  }),
});

// /chat/user/:user_id
export const userIdParamSchema = Joi.object({
  user_id: idSchema.required().messages({
    "any.required": "User ID là bắt buộc",
    "any.invalid": "User ID không hợp lệ",
  }),
});

// POST /chat
export const createMessageSchema = Joi.object({
  seller_id: idSchema.required().messages({
    "any.required": "Seller ID là bắt buộc",
    "any.invalid": "Seller ID không hợp lệ",
  }),

  user_id: idSchema.required().messages({
    "any.required": "User ID là bắt buộc",
    "any.invalid": "User ID không hợp lệ",
  }),

  content: Joi.string().trim().min(1).required().messages({
    "string.base": "Nội dung tin nhắn phải là chuỗi",
    "string.empty": "Nội dung tin nhắn không được để trống",
    "any.required": "Nội dung tin nhắn là bắt buộc",
  }),
});

// PATCH /chat/:id
export const updateMessageSchema = Joi.object({
  content: Joi.string().trim().min(1).required().messages({
    "string.base": "Nội dung tin nhắn phải là chuỗi",
    "string.empty": "Nội dung tin nhắn không được để trống",
    "any.required": "Nội dung tin nhắn là bắt buộc",
  }),
});
