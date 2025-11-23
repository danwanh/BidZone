import OTP from "../models/otp.model.js";
import { sendEmail } from "../utils/mailsender.js";

export const sendOTP = async (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 số

  await OTP.create({
    email,
    otp,
    expireAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  await sendEmail(email, "Your OTP Code", `Your OTP is: ${otp}`);

  res.json({ message: "OTP sent to email" });
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const record = await Otp.findOne({ email, otp });

  if (!record) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  // Xoá OTP sau khi dùng
  await Otp.deleteMany({ email });

  res.json({ message: "OTP verified, you can continue registration" });
};