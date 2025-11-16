import express from "express";
import {
    getAllUsers,
    getUserById,
    getProfile,
    updateUser,
    updateUserRole,
    deleteUser,
    toggleUserBan
} from "../controllers/userController.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();



// PROTECTED ROUTES

// READ
// GET /api/users/me - Get current user profile
router.get("/me", authenticate, getProfile);

// GET /api/users - Get all users (Admin only)
router.get("/", authenticate, isAdmin, getAllUsers);

// GET /api/users/:id - Get user by ID
router.get("/:id", authenticate, getUserById);

// UPDATE
// PUT /api/users/:id - Update user profile
router.put("/:id", authenticate, updateUser);

// PUT /api/users/:id/role - Update user role (Admin only)
router.put("/:id/role", authenticate, isAdmin, updateUserRole);

// PUT /api/users/:id/ban - Ban/Unban user (Admin only)
router.put("/:id/ban", authenticate, isAdmin, toggleUserBan);

// DELETE
// DELETE /api/users/:id - Delete user (Admin only)
router.delete("/:id", authenticate, isAdmin, deleteUser);

export default router;
