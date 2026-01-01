import express from "express";
import {
  getAllUsers,
  getUserById,
  getProfile,
  updateUser,
  updateUserRole,
  deleteUser,
  toggleUserBan,
  rateUp,
  rateDown,
  changePassword,
  createUser,
  setPrivate,
  setPublic,
  softDeleteUser,
} from "../controllers/userController.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";
import {
  createUserSchema,
  updateUserSchema,
  changePasswordSchema,
  updateUserRoleSchema,
  toggleUserBanSchema,
  getAllUsersSchema,
  userIdSchema,
} from "../schemas/UserSchema.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

// PROTECTED ROUTES

// READ
// GET /api/users/me - Get current user profile
router.get("/me", authenticate, getProfile);

// GET /api/users - Get all users (Admin only)
router.get(
  "/",
  authenticate,
  isAdmin,
  validate({ query: getAllUsersSchema }), // Xác thực dữ liệu query (role, q)
  getAllUsers
);

// GET /api/users/:id - Get user by ID
router.get(
  "/:id",
  authenticate,
  validate({ params: userIdSchema }), // Xác thực ID trong URL
  getUserById
);

// UPDATE
// PUT /api/users/:id - Update user profile
router.put(
  "/:id",
  authenticate,
  validate({ params: userIdSchema}), // Xác thực ID và body
  updateUser
);

// PATCH /api/users/rateup - Rate up user
router.patch("/rateup", authenticate, validate({ body: userIdSchema }), rateUp);

// PATCH /api/users/ratedown - Rate down user
router.patch(
  "/ratedown",
  authenticate,
  validate({ body: userIdSchema }), // Xác thực body để "rate down"
  rateDown
);

// PUT /api/users/:id/role - Update user role (Admin only)
router.put(
  "/:id/role",
  authenticate,
  isAdmin,
  validate({ params: userIdSchema, body: updateUserRoleSchema }), // Xác thực ID và role trong body
  updateUserRole
);

// PUT /api/users/:id/ban - Ban/Unban user (Admin only)
router.put(
  "/:id/ban",
  authenticate,
  isAdmin,
  validate({ params: userIdSchema, body: toggleUserBanSchema }), // Xác thực ID và trạng thái ban
  toggleUserBan
);

// PATCH /api/users/private - Set user profile to private
router.patch(
  "/private",
  authenticate,
  validate({ body: userIdSchema }), // Xác thực body để đặt chế độ riêng tư
  setPrivate
);

// PATCH /api/users/public - Set user profile to public
router.patch(
  "/public",
  authenticate,
  validate({ body: userIdSchema }), // Xác thực body để đặt chế độ công khai
  setPublic
);

// DELETE
// DELETE /api/users/:id - Delete user (Admin only)
router.delete(
  "/:id",
  authenticate,
  isAdmin,
  validate({ params: userIdSchema }), // Xác thực ID trong URL
  deleteUser
);

// POST /api/users/change-password - Change user password
router.post(
  "/change-password",
  authenticate,
  validate({ body: changePasswordSchema }), // Xác thực dữ liệu thay đổi mật khẩu
  changePassword
);

// POST /api/users - Create user
router.post(
  "/",
  validate({ body: createUserSchema }), // Xác thực body khi tạo người dùng mới
  createUser
);

router.delete("/soft/:id", softDeleteUser);

export default router;
