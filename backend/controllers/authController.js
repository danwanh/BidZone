import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { verifyCaptcha } from "../middleware/verifyCaptcha.js";

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.ACCESS_SECRET,
    { expiresIn: process.env.accessTokenExpiry }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.ACCESS_SECRET,
    { expiresIn: process.env.refreshTokenExpiry }
  );

  return { accessToken, refreshToken };
};

// REGISTER - Create new user
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, address, dob, role, captcha } =
      req.body;

    const isHuman = verifyCaptcha(req, res, captcha);

    if (!isHuman) {
      return res.status(400).json({ message: "Captcha validation failed" });
    }

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

    // await newUser.save();

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
    const { email, password, captcha } = req.body;

    const isHuman = verifyCaptcha(req, res, captcha);

    if (!isHuman) {
      return res.status(400).json({ message: "Captcha validation failed" });
    }

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
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

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
