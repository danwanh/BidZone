//backend/schemas/AuthSchema.js
// backend/schemas/AuthSchema.js
import Joi from "joi";

// REGISTER - Create new user
export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name should have at least 3 characters",
    "string.max": "Name should have at most 50 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email",
  }),
  password: Joi.string().min(1).max(128).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password should have at least 1 character",
    "string.max": "Password should have at most 128 characters",
  }),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
      "string.empty": "Confirm password is required",
    }),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  dob: Joi.date().optional(),
  role: Joi.string().valid("bidder", "admin", "seller").optional(),
});

// LOGIN
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
  recaptcha: Joi.string().required().messages({
    "string.empty": "Recaptcha is required",
  }),
});

// CHECK EMAIL (for /auth/check-email) and RESET PASSWORD (for /auth/reset-password)
export const emailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email cannot be empty",
    "string.email": "Email must be valid",
  }),
});


