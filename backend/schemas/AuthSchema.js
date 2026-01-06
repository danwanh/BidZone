//backend/schemas/AuthSchema.js
// backend/schemas/AuthSchema.js
import Joi from "joi";

// REGISTER - Create new user
export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Tên là bắt buộc",
    "string.min": "Tên phải có ít nhất 3 ký tự",
    "string.max": "Tên không được vượt quá 50 ký tự",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email là bắt buộc",
    "string.email": "Email không hợp lệ",
  }),
  password: Joi.string().min(1).max(128).required().messages({
    "string.empty": "Mật khẩu là bắt buộc",
    "string.min": "Mật khẩu phải có ít nhất 1 ký tự",
    "string.max": "Mật khẩu không được vượt quá 128 ký tự",
  }),
  confirm_password: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Mật khẩu xác nhận không khớp",
      "string.empty": "Vui lòng xác nhận mật khẩu",
    }),
  recaptcha: Joi.string().required().messages({
    "string.empty": "Recaptcha là bắt buộc",
  }),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  dob: Joi.date().optional(),
  role: Joi.string().valid("bidder", "admin", "seller").optional(),
});

// LOGIN
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email là bắt buộc",
    "string.email": "Email không hợp lệ",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Mật khẩu là bắt buộc",
  }),
  recaptcha: Joi.string().required().messages({
    "string.empty": "Recaptcha là bắt buộc",
  }),
});

// CHECK EMAIL (for /auth/check-email) and RESET PASSWORD (for /auth/reset-password)
export const emailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email không được để trống",
    "string.email": "Email không hợp lệ",
  }),
});
