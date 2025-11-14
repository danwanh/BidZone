import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  ACCESS_SECRET,
  REFRESH_SECRET,
  accessTokenExpiry,
  refreshTokenExpiry,
} from "../config/jwt.js";
import User from "../models/user.model.js";

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    ACCESS_SECRET,
    { expiresIn: accessTokenExpiry }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    REFRESH_SECRET,
    { expiresIn: refreshTokenExpiry }
  );

  return { accessToken, refreshToken };
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username){
    return res.status(400).json({ message: "Missing username" });
  }else if (!email){
    return res.status(400).json({ message: "Missing email" });
  }else if (!password){
    return res.status(400).json({ message: "Missing password" });
  }

  const hash = await bcrypt.hash(password, 10);

  const newUser = new User({ username, email, hash });

  await newUser.save();

  const tokens = generateTokens(newUser);

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: false, // change to true in production
    sameSite: "strict",
  });

  res.status(201).json({ message: "User created successfully"});
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "Wrong email or password" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Wrong email or password" });

  const tokens = generateTokens(user);

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  res.status(200).json({message: "Login successfully"});
};

export const refresh = (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      ACCESS_SECRET,
      { expiresIn: accessTokenExpiry }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};
