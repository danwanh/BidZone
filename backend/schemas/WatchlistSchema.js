import Joi from "joi";
import { idSchema } from "./IdSchema.js"; // Giả sử bạn đã có schema id hợp lệ

// Schema cho User ID trong params
export const watchlistUserIdSchema = Joi.object({
  userId: idSchema.required().messages({
    "any.required": "User ID là bắt buộc",
    "any.invalid": "Định dạng User ID không hợp lệ",
  }),
});

// Schema cho Product ID trong params
export const productIdSchema = Joi.object({
  productId: idSchema.required().messages({
    "any.required": "Product ID là bắt buộc",
    "any.invalid": "Định dạng Product ID không hợp lệ",
  }),
});

// Schema cho Watchlist ID trong params
export const watchlistIdSchema = Joi.object({
  id: idSchema.required().messages({
    "any.required": "Watchlist ID là bắt buộc",
    "any.invalid": "Định dạng Watchlist ID không hợp lệ",
  }),
});

// Schema cho dữ liệu tạo Watchlist trong body
export const createWatchlistBodySchema = Joi.object({
  user_id: idSchema.required().messages({
    "any.required": "User ID là bắt buộc",
    "any.invalid": "Định dạng User ID không hợp lệ",
  }),
  product_id: Joi.array().items(idSchema).required().messages({
    "any.required": "Product IDs là bắt buộc",
    "array.includesRequiredUnknowns": "Một hoặc nhiều Product ID không hợp lệ",
    "any.invalid": "Định dạng Product ID không hợp lệ",
  }),
});

// Schema cho dữ liệu thêm sản phẩm vào Watchlist
export const addToWatchlistBodySchema = Joi.object({
  product_id: idSchema.required().messages({
    "any.required": "Product ID là bắt buộc",
    "any.invalid": "Định dạng Product ID không hợp lệ",
  }),
});

export const deleteWatchlistSchema = Joi.object({
  userId: idSchema.required().messages({
    "any.required": "User ID là bắt buộc",
    "any.invalid": "Định dạng User ID không hợp lệ",
  }),
  productId: idSchema.required().messages({
    "any.required": "Product ID là bắt buộc",
    "any.invalid": "Định dạng Product ID không hợp lệ",
  }),
});


