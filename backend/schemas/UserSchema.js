import Joi from "joi";
import { idSchema } from "./IdSchema.js";

export const userIdSchema = Joi.object({
  id: idSchema.required().messages({
    "any.required": "User ID là bắt buộc",
    "any.invalid": "Định dạng User ID không hợp lệ",
  }),
});

// Schema cho việc tạo người dùng
export const createUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.base": "Tên người dùng phải là một chuỗi",
    "string.empty": "Tên người dùng không được để trống",
    "string.min": "Tên người dùng phải có ít nhất 3 ký tự",
    "string.max": "Tên người dùng tối đa 30 ký tự",
    "any.required": "Tên người dùng là bắt buộc",
  }),
  name: Joi.string().min(2).max(100).required().messages({
    "string.base": "Họ và tên phải là một chuỗi",
    "string.empty": "Họ và tên không được để trống",
    "string.min": "Họ và tên phải có ít nhất 2 ký tự",
    "string.max": "Họ và tên tối đa 100 ký tự",
    "any.required": "Họ và tên là bắt buộc",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email phải là một chuỗi",
    "string.empty": "Email không được để trống",
    "string.email": "Email không hợp lệ",
    "any.required": "Email là bắt buộc",
  }),
  password: Joi.string().min(6).max(100).required().messages({
    "string.base": "Mật khẩu phải là một chuỗi",
    "string.empty": "Mật khẩu không được để trống",
    "string.min": "Mật khẩu phải có ít nhất 6 ký tự",
    "string.max": "Mật khẩu tối đa 100 ký tự",
    "any.required": "Mật khẩu là bắt buộc",
  }),
  address: Joi.string().optional().messages({
    "string.base": "Địa chỉ phải là một chuỗi",
  }),
  dob: Joi.date().optional().messages({
    "date.base": "Ngày sinh không hợp lệ",
  }),
  gender: Joi.string().valid('Nam', 'Nữ', 'Khác').optional().messages({
    "string.base": "Giới tính phải là một chuỗi",
    "any.only": "Giới tính chỉ có thể là 'Nam', 'Nữ' hoặc 'Khác'",
  }),
  role: Joi.string().valid('bidder', 'seller', 'admin').default('bidder').messages({
    "string.base": "Vai trò phải là một chuỗi",
    "any.only": "Vai trò chỉ có thể là 'bidder', 'seller' hoặc 'admin'",
  }),
});

// Schema cho việc cập nhật thông tin người dùng
export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional().messages({
    "string.base": "Họ và tên phải là một chuỗi",
    "string.min": "Họ và tên phải có ít nhất 2 ký tự",
    "string.max": "Họ và tên tối đa 100 ký tự",
  }),
  email: Joi.string().email().optional().messages({
    "string.base": "Email phải là một chuỗi",
    "string.email": "Email không hợp lệ",
  }),
  phonenumber: Joi.string().optional().messages({
    "string.base": "Số điện thoại phải là một chuỗi",
  }),
  address: Joi.string().optional().messages({
    "string.base": "Địa chỉ phải là một chuỗi",
  }),
  dob: Joi.date().optional().messages({
    "date.base": "Ngày sinh không hợp lệ",
  }),
  password: Joi.string().min(6).max(100).optional().messages({
    "string.base": "Mật khẩu phải là một chuỗi",
    "string.min": "Mật khẩu phải có ít nhất 6 ký tự",
    "string.max": "Mật khẩu tối đa 100 ký tự",
  }),
  gender: Joi.string().valid('Nam', 'Nữ', 'Khác').optional().messages({
    "string.base": "Giới tính phải là một chuỗi",
    "any.only": "Giới tính chỉ có thể là 'Nam', 'Nữ' hoặc 'Khác'",
  }),
  username: Joi.string().min(3).max(30).optional().messages({
    "string.base": "Tên người dùng phải là một chuỗi",
    "string.min": "Tên người dùng phải có ít nhất 3 ký tự",
    "string.max": "Tên người dùng tối đa 30 ký tự",
  }),
});

// Schema cho việc thay đổi mật khẩu
export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(6).max(100).required().messages({
    "string.base": "Mật khẩu cũ phải là một chuỗi",
    "string.min": "Mật khẩu cũ phải có ít nhất 6 ký tự",
    "string.max": "Mật khẩu cũ tối đa 100 ký tự",
    "any.required": "Mật khẩu cũ là bắt buộc",
  }),
  newPassword: Joi.string().min(6).max(100).required().messages({
    "string.base": "Mật khẩu mới phải là một chuỗi",
    "string.min": "Mật khẩu mới phải có ít nhất 6 ký tự",
    "string.max": "Mật khẩu mới tối đa 100 ký tự",
    "any.required": "Mật khẩu mới là bắt buộc",
  }),
});

// Schema cho việc cập nhật vai trò người dùng
export const updateUserRoleSchema = Joi.object({
  role: Joi.string().valid('bidder', 'seller', 'admin').required().messages({
    "string.base": "Vai trò phải là một chuỗi",
    "any.only": "Vai trò chỉ có thể là 'bidder', 'seller' hoặc 'admin'",
    "any.required": "Vai trò là bắt buộc",
  }),
});

// Schema cho việc ban hoặc bỏ ban người dùng
export const toggleUserBanSchema = Joi.object({
  is_banned: Joi.boolean().required().messages({
    "boolean.base": "Trạng thái bị cấm phải là kiểu boolean",
    "any.required": "Trạng thái bị cấm là bắt buộc",
  }),
});

// Schema cho việc tìm kiếm người dùng (tùy chọn lọc theo role và từ khóa)
export const getAllUsersSchema = Joi.object({
  role: Joi.string().valid('bidder', 'seller', 'admin').optional().messages({
    "string.base": "Vai trò phải là một chuỗi",
    "any.only": "Vai trò chỉ có thể là 'bidder', 'seller' hoặc 'admin'",
  }),
  q: Joi.string().optional().messages({
    "string.base": "Từ khóa tìm kiếm phải là một chuỗi",
  }),
});
