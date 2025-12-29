// src/schemas/ProductSchema.js
import Joi from 'joi';
import { idSchema } from './IdSchema.js';

// Validate product creation schema
export const createProductSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Tên sản phẩm là bắt buộc',
  }),
  description: Joi.string().optional(),
  category_id: idSchema.required().messages({
      'any.invalid': 'ID danh mục không hợp lệ',
      'any.required': 'Danh mục là bắt buộc',
    }),
  seller_id: idSchema.required().messages({
      'any.invalid': 'ID người bán không hợp lệ',
      'any.required': 'ID người bán là bắt buộc',
    }),
  start_price: Joi.number().required().messages({
    'any.required': 'Giá bắt đầu là bắt buộc',
  }),
  bid_step: Joi.number().optional(),
  buy_now_price: Joi.number().optional(),
  current_price: Joi.number().optional(),
  start_time: Joi.date().required().messages({
    'any.required': 'Thời gian bắt đầu là bắt buộc',
  }),
  end_time: Joi.date().required().messages({
    'any.required': 'Thời gian kết thúc là bắt buộc',
  }),
  is_autobid: Joi.boolean().optional(),
  status: Joi.string().valid('active', 'ended', 'cancelled').required().messages({
    'any.required': 'Trạng thái là bắt buộc',
    'any.only': 'Trạng thái không hợp lệ',
  }),
  total_bids: Joi.number().optional(),
  banned_bidders: Joi.array().items(Joi.string()).optional(),
  allow_unrated_bidders: Joi.boolean().optional(),
  slug: Joi.string().optional(),
  image_url: Joi.array()
    .items(Joi.string().uri().required().messages({
      'any.required': 'URL hình ảnh là bắt buộc',
      'string.uri': 'Đường dẫn hình ảnh không hợp lệ',
    }))
    .min(3)
    .required()
    .messages({
      'array.min': 'Vui lòng tải lên ít nhất 3 hình ảnh',
      'any.required': 'URL hình ảnh là bắt buộc',
    }),
});

// Validate product ID for routes like GET, DELETE, and PATCH
export const productIdParamSchema = Joi.object({
  id: idSchema.required().messages({
      'any.invalid': 'ID sản phẩm không hợp lệ',
      'any.required': 'ID sản phẩm là bắt buộc',
    }),
});

// Validate product update schema (e.g., for PATCH requests)
export const updateProductSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  category_id: idSchema.optional(),
  seller_id: idSchema.optional(),
  start_price: Joi.number().optional(),
  bid_step: Joi.number().optional(),
  buy_now_price: Joi.number().optional(),
  current_price: Joi.number().optional(),
  start_time: Joi.date().optional(),
  end_time: Joi.date().optional(),
  is_autobid: Joi.boolean().optional(),
  status: Joi.string().valid('active', 'ended', 'cancelled').optional(),
  total_bids: Joi.number().optional(),
  banned_bidders: Joi.array().items(Joi.string()).optional(),
  allow_unrated_bidders: Joi.boolean().optional(),
  slug: Joi.string().optional(),
  image_url: Joi.array()
    .items(Joi.string().uri().required().messages({
      'any.required': 'URL hình ảnh là bắt buộc',
      'string.uri': 'Đường dẫn hình ảnh không hợp lệ',
    }))
    .min(3)
    // .optional()
    .messages({
      'array.min': 'Vui lòng tải lên ít nhất 3 hình ảnh',
    }),
});
