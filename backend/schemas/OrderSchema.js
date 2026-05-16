import Joi from "joi";
import { idSchema } from "./IdSchema.js";

// /orders/:id
export const orderIdParamSchema = Joi.object({
  id: idSchema.required().messages({
    "any.required": "Order ID là bắt buộc",
    "any.invalid": "Order ID không hợp lệ",
  }),
});

// /orders/product/:product_id
export const productIdParamSchema = Joi.object({
  product_id: idSchema.required().messages({
    "any.required": "Product ID là bắt buộc",
    "any.invalid": "Product ID không hợp lệ",
  }),
});

// /orders/user/:user_id
export const userIdParamSchema = Joi.object({
  user_id: idSchema.required().messages({
    "any.required": "User ID là bắt buộc",
    "any.invalid": "User ID không hợp lệ",
  }),
});

// POST /orders
export const createOrderSchema = Joi.object({
  product_id: idSchema.required().messages({
    "any.required": "Product ID là bắt buộc",
    "any.invalid": "Product ID không hợp lệ",
  }),

  seller_id: idSchema.required().messages({
    "any.required": "Seller ID là bắt buộc",
    "any.invalid": "Seller ID không hợp lệ",
  }),

  buyer_id: idSchema.required().messages({
    "any.required": "Buyer ID là bắt buộc",
    "any.invalid": "Buyer ID không hợp lệ",
  }),
});

// PUT /orders/:id
export const updateOrderSchema = Joi.object({
  status: Joi.string()
    .valid(
      "pending_payment",
      "pending_shipping",
      "pending_delivery",
      "completed",
      "cancelled"
    )
    .messages({
      "any.only": "Trạng thái đơn hàng không hợp lệ",
    }),

  invoice_info: Joi.string().optional(),
  delivery_info: Joi.string().optional(),

  address: Joi.string().trim().messages({
    "string.base": "Địa chỉ phải là chuỗi",
  }),

  cancellation_reason: Joi.string().trim().messages({
    "string.base": "Lý do hủy phải là chuỗi",
  }),

  cancelled_by: Joi.string().valid("buyer", "seller", "admin").messages({
    "any.only": "cancelled_by phải là buyer, seller hoặc admin",
  }),
})
  .min(1)
  .messages({
    "object.min": "Cần cập nhật ít nhất một trường",
  });

// POST /orders/:id/messages
export const sendOrderMessageSchema = Joi.object({
  content: Joi.string().trim().min(1).required().messages({
    "string.empty": "Nội dung tin nhắn không được để trống",
    "any.required": "Nội dung tin nhắn là bắt buộc",
  }),
});


