import Joi from "joi";
import { idSchema } from "./IdSchema.js";

// /orders/:id
export const orderIdParamSchema = Joi.object({
  id: idSchema.required().messages({
    "any.required": "Order ID is required",
    "any.invalid": "Invalid Order ID",
  }),
});

// /orders/product/:product_id
export const productIdParamSchema = Joi.object({
  product_id: idSchema.required().messages({
    "any.required": "Product ID is required",
    "any.invalid": "Invalid Product ID",
  }),
});

// /orders/user/:user_id
export const userIdParamSchema = Joi.object({
  user_id: idSchema.required().messages({
    "any.required": "User ID is required",
    "any.invalid": "Invalid User ID",
  }),
});

// POST /orders
export const createOrderSchema = Joi.object({
  product_id: idSchema.required().messages({
    "any.required": "Product ID is required",
    "any.invalid": "Invalid Product ID",
  }),

  seller_id: idSchema.required().messages({
    "any.required": "Seller ID is required",
    "any.invalid": "Invalid Seller ID",
  }),

  buyer_id: idSchema.required().messages({
    "any.required": "Buyer ID is required",
    "any.invalid": "Invalid Buyer ID",
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
      "any.only": "Invalid order status",
    }),

  invoice_info: Joi.object().unknown(true).messages({
    "object.base": "Invoice info must be an object",
  }),

  delivery_info: Joi.object().unknown(true).messages({
    "object.base": "Delivery info must be an object",
  }),

  address: Joi.string().trim().messages({
    "string.base": "Address must be a string",
  }),

  cancellation_reason: Joi.string().trim().messages({
    "string.base": "Cancellation reason must be a string",
  }),

  cancelled_by: Joi.string().valid("buyer", "seller", "admin").messages({
    "any.only": "cancelled_by must be buyer, seller or admin",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be updated",
  });

// POST /orders/:id/messages
export const sendOrderMessageSchema = Joi.object({
  content: Joi.string().trim().min(1).required().messages({
    "string.empty": "Message content cannot be empty",
    "any.required": "Message content is required",
  }),
});
