import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { generateTokens, generateRandomPassword } from "../services/authServices.js";
import { sendEmail } from "../services/mailServices.js";

// REGISTER - Create new user
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, address, dob, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { name }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email or name already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      name,
      email,
      password_hash,
      phone,
      address,
      dob,
      role: "bidder", // Default to bidder
      rating_pos: 0,
      rating_neg: 0,
      is_verified: false,
    });

    await newUser.save();

    // Generate JWT token
    const tokens = generateTokens(newUser);

    //Send refreshToken to user cookie
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
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Wrong email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong email or password" });
    }

    // Generate token
    const tokens = generateTokens(user);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Login successfully",
      accessToken: tokens.accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ message: err.message });
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
export const checkEmail = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: "Email không được rỗng" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email này đã được sử dụng" });
    }
    res.status(200).json({ message: "Email hợp lệ" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const oauthSuccess = async (req, res) => {
  try {
    const user = req.user; // passport attaches this

    const { accessToken, refreshToken } = generateTokens(user);

    // Set refreshToken cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });

    // Redirect back to frontend with access token
    res.redirect(
      `${
        process.env.FRONTEND_URL
      }/auth/social-success?token=${encodeURIComponent(accessToken)}`
    );
  } catch (err) {
    console.error("OAuth login error:", err);
    res.redirect(`${process.env.FRONTEND_URL}/auth/social-failed`);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email không được rỗng" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // 1. Tạo mật khẩu mới
    const newPassword = generateRandomPassword();

    // 2. Hash mật khẩu
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // 3. Cập nhật DB
    user.password_hash = newPasswordHash;
    await user.save();

    const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
      <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 24px; border-radius: 8px;">
        
        <h2 style="color: #2d3748; text-align: center;">
          Đặt lại mật khẩu BidZone
        </h2>

        <p style="color: #4a5568;">
          Xin chào,
        </p>

        <p style="color: #4a5568;">
          Chúng tôi đã tạo <strong>mật khẩu mới</strong> cho tài khoản của bạn:
        </p>

        <div style="
          background: #edf2f7;
          padding: 12px;
          font-size: 18px;
          text-align: center;
          letter-spacing: 1px;
          border-radius: 6px;
          margin: 16px 0;
          font-weight: bold;
        ">
          ${newPassword}
        </div>

        <p style="color: #e53e3e; font-weight: bold;">
           Vui lòng KHÔNG chia sẻ mật khẩu này cho bất kỳ ai.
        </p>

        <p style="color: #4a5568;">
          Sau khi đăng nhập, bạn nên đổi mật khẩu ngay để đảm bảo an toàn.
        </p>

        <hr style="margin: 24px 0;" />

        <p style="font-size: 12px; color: #718096; text-align: center;">
          © ${new Date().getFullYear()} BidZone. All rights reserved.
        </p>

        </div>
      </div>
      `;

    await sendEmail(
      email,
      "Mật khẩu mới BidZone",
      html
    );

    // 4. (Tùy chọn) Gửi email → hiện tại trả về JSON để test
    return res.status(200).json({
      message: "Mật khẩu đã được đặt lại",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: err.message });
  }
};
