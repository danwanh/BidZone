import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


// READ - Get all users (Admin only)
export const getAllUsers = async (req, res) => {
    try {
        const { role } = req.query; // Filter by role if provided

        let query = {};
        if (role) {
            query.role = role;
        }

        const users = await User.find(query).select("-password_hash -reset_password_token");
        res.json(users);
    } catch (err) {
        console.error("Error getting users:", err);
        res.status(500).json({ message: err.message });
    }
};

// READ - Get user by ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await User.findById(id).select("-password_hash -reset_password_token");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        console.error("Error getting user:", err);
        res.status(500).json({ message: err.message });
    }
};

// READ - Get current user profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password_hash -reset_password_token");
        res.json(user);
    } catch (err) {
        console.error("Error getting profile:", err);
        res.status(500).json({ message: err.message });
    }
};

// UPDATE - Update user profile
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address, dob, password } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // Check authorization (user can only update their own profile, unless admin)
        if (req.user._id.toString() !== id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update fields
        if (name) user.name = name;
        if (email) {
            // Check if email is already taken
            const emailExists = await User.findOne({ email, _id: { $ne: id } });
            if (emailExists) {
                return res.status(400).json({ message: "Email already in use" });
            }
            user.email = email;
        }
        if (phone) user.phone = phone;
        if (address) user.address = address;
        if (dob) user.dob = dob;
        
        // Update password if provided
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password_hash = await bcrypt.hash(password, salt);
        }

        await user.save();
        
        const updatedUser = await User.findById(id).select("-password_hash -reset_password_token");
        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ message: err.message });
    }
};

// UPDATE - Update user role (Admin only)
export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const validRoles = ["bidder", "seller", "admin"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.role = role;
        await user.save();

        res.json({ message: "User role updated", user });
    } catch (err) {
        console.error("Error updating user role:", err);
        res.status(500).json({ message: err.message });
    }
};

// DELETE - Delete user (Admin only)
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ message: err.message });
    }
};

// UPDATE - Ban/Unban user (Admin only)
export const toggleUserBan = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_banned } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // You might want to add an is_banned field to your User model
        // For now, we could use is_verified as a proxy or add the field
        
        res.json({ 
            message: is_banned ? "User banned" : "User unbanned",
            user 
        });
    } catch (err) {
        console.error("Error toggling user ban:", err);
        res.status(500).json({ message: err.message });
    }
};
