import * as userService from "../services/userService.js";

// READ - Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers(req.validated.query);
    res.json(users);
  } catch (err) {
    console.error("Error getting users:", err);
    res.status(500).json({ message: err.message });
  }
};

// READ - Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.validated.params.id);
    res.json({ message: "Success", user: user });
  } catch (err) {
    console.error("Error getting user:", err);
    res.status(err.message === "User not found" ? 404 : 500).json({ message: err.message });
  }
};

// READ - Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user._id);
    res.json(user);
  } catch (err) {
    console.error("Error getting profile:", err);
    res.status(err.message === "User not found" ? 404 : 500).json({ message: err.message });
  }
};

// UPDATE - Update user profile
export const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.validated.params.id, req.validated.body);
    res.json({
      message: "User updated successfully",
      user,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(err.message === "User not found" ? 404 : err.message === "Email already in use" ? 400 : 500).json({ message: err.message });
  }
};

// UPDATE - Update user role (Admin only)
export const updateUserRole = async (req, res) => {
  try {
    const user = await userService.updateUserRole(req.validated.params.id, req.validated.body.role);
    res.json({ message: "User role updated", user });
  } catch (err) {
    console.error("Error updating user role:", err);
    res.status(err.message === "User not found" ? 404 : 500).json({ message: err.message });
  }
};

// DELETE - Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.validated.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(err.message === "User not found" ? 404 : 500).json({ message: err.message });
  }
};

// UPDATE - Ban/Unban user (Admin only)
export const toggleUserBan = async (req, res) => {
  try {
    const { id } = req.validated.params;
    const { is_banned } = req.validated.body;
    const user = await userService.getUserById(id);
    // Placeholder as original logic was incomplete
    res.json({
      message: is_banned ? "User banned" : "User unbanned",
      user,
    });
  } catch (err) {
    console.error("Error toggling user ban:", err);
    res.status(err.message === "User not found" ? 404 : 500).json({ message: err.message });
  }
};

export const rateUp = async (req, res) => {
  try {
    await userService.rateUp(req.validated.body?.id);
    return res.status(200).json({ message: "User rated up successfully" });
  } catch (err) {
    console.log(err);
    res.status(err.message === "No user with that id" ? 400 : 500).json({ message: err.message || "Server error" });
  }
};

export const rateDown = async (req, res) => {
  try {
    await userService.rateDown(req.validated.body?.id);
    return res.status(200).json({ message: "User rated down successfully" });
  } catch (err) {
    console.log(err);
    res.status(err.message === "No user with that id" ? 400 : 500).json({ message: err.message || "Server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.validated.body;
    await userService.changePassword(req.user._id, oldPassword, newPassword);
    return res.status(200).json({ message: "Mật khẩu đã được đổi lại" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(err.message === "Wrong password" ? 400 : 500).json({ message: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.validated.body);
    return res.status(201).json(user);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: "Can't add user" });
  }
};

export const setPrivate = async (req, res) => {
  try {
    const { id } = req.validated.body;
    if (id !== req.user._id.toString()) {
      return res.status(400).json({ message: "Not your account" });
    }
    await userService.setPrivateStatus(id, true);
    res.status(200).json({ message: "Account set to private" });
  } catch (err) {
    console.log(err);
    res.status(err.message === "No user found" ? 400 : 500).json({ message: err.message || "Server error" });
  }
};

export const setPublic = async (req, res) => {
  try {
    const { id } = req.validated.body;
    if (id !== req.user._id.toString()) {
      return res.status(400).json({ message: "Not your account" });
    }
    await userService.setPrivateStatus(id, false);
    res.status(200).json({ message: "Account set to public" });
  } catch (err) {
    console.log(err);
    res.status(err.message === "No user found" ? 400 : 500).json({ message: err.message || "Server error" });
  }
};

export const softDeleteUser = async (req, res) => {
  try {
    await userService.softDeleteUser(req.params.id);
    res.status(200).json({ message: "User soft deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(err.message === "User not found" ? 404 : 500).json({ message: err.message || "Server error" });
  }
};
