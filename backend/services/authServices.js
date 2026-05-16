import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import { sendEmail } from "./mailServices.js";

export const generateTokens = (user) => {
  try {
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_SECRET,
      { expiresIn: process.env.accessTokenExpiry }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.REFRESH_SECRET,
      { expiresIn: process.env.refreshTokenExpiry }
    );

    return { accessToken, refreshToken };
  } catch (err) {
    console.error("Error generating tokens:" + err);
    throw err;
  }
};

export const generateRandomPassword = (length = 10) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&**()_+[]{}<>?";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

export const register = async (userData) => {
  const { name, email, password, phone, address, dob } = userData;

  const existingUser = await User.findOne({ $or: [{ email }, { name }] });
  if (existingUser) throw new Error("User with this email or name already exists");

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const newUser = new User({
    name, email, password_hash, phone, address, dob,
    role: "bidder", rating_pos: 0, rating_neg: 0, is_verified: false,
  });

  await newUser.save();
  return newUser;
};

export const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Wrong email or password");

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new Error("Wrong email or password");

  return user;
};

export const resetPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Không tìm thấy người dùng");

  const newPassword = generateRandomPassword();
  const salt = await bcrypt.genSalt(10);
  user.password_hash = await bcrypt.hash(newPassword, salt);
  await user.save();

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
      <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 24px; border-radius: 8px;">
        <h2 style="color: #2d3748; text-align: center;">Đặt lại mật khẩu BidZone</h2>
        <p style="color: #4a5568;">Xin chào,</p>
        <p style="color: #4a5568;">Chúng tôi đã tạo <strong>mật khẩu mới</strong> cho tài khoản của bạn:</p>
        <div style="background: #edf2f7; padding: 12px; font-size: 18px; text-align: center; letter-spacing: 1px; border-radius: 6px; margin: 16px 0; font-weight: bold;">
          ${newPassword}
        </div>
        <p style="color: #e53e3e; font-weight: bold;">Vui lòng KHÔNG chia sẻ mật khẩu này cho bất kỳ ai.</p>
        <p style="color: #4a5568;">Sau khi đăng nhập, bạn nên đổi mật khẩu ngay để đảm bảo an toàn.</p>
        <hr style="margin: 24px 0;" />
        <p style="font-size: 12px; color: #718096; text-align: center;">© ${new Date().getFullYear()} BidZone. All rights reserved.</p>
      </div>
    </div>
  `;

  await sendEmail(email, "Mật khẩu mới BidZone", html);
  return true;
};
export const checkEmailAvailability = async (email) => {
  const user = await User.findOne({ email });
  return !user;
};
