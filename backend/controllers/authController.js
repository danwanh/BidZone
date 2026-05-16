import * as authService from "../services/authServices.js";
import jwt from "jsonwebtoken";

// REGISTER - Create new user
export const register = async (req, res) => {
  try {
    const newUser = await authService.register(req.validated.body);
    const tokens = authService.generateTokens(newUser);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: false, // change to true in production
      sameSite: "strict",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(err.message.includes("already exists") ? 400 : 500).json({ message: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.validated.body;
    const user = await authService.login(email, password);
    const tokens = authService.generateTokens(user);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Login successfully",
      accessToken: tokens.accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(err.message === "Wrong email or password" ? 400 : 500).json({ message: err.message });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Error logging out:", err);
    res.status(500).json({ message: "Error logging out" });
  }
};

export const refresh = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.ACCESS_SECRET,
      { expiresIn: process.env.accessTokenExpiry }
    );
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

// POST /auth/check-email
export const checkEmailAvailability = async (req, res) => {
  try {
    const { email } = req.validated.body;
    const isAvailable = await authService.checkEmailAvailability(email);
    if (!isAvailable) {
      return res.status(400).json({ message: "Email này đã được sử dụng" });
    }
    res.status(200).json({ message: "Email hợp lệ" });
  } catch (err) {
    console.error("Error checking email availability:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const oauthSuccess = async (req, res) => {
  try {
    const user = req.user;
    const { accessToken, refreshToken } = authService.generateTokens(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });

    res.redirect(
      `${process.env.FRONTEND_URL}/auth/social-success?token=${encodeURIComponent(accessToken)}`
    );
  } catch (err) {
    console.error("OAuth login error:", err);
    res.redirect(`${process.env.FRONTEND_URL}/auth/social-failed`);
  }
};

export const resetPassword = async (req, res) => {
  try {
    await authService.resetPassword(req.validated.body.email);
    return res.status(200).json({ message: "Mật khẩu đã được đặt lại" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(err.message === "Không tìm thấy người dùng" ? 404 : 500).json({ message: err.message });
  }
};
