import OTP from "../models/otp.model.js";
import { sendEmail } from "./mailServices.js";

export const sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Missing email" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 số
  try {
    await OTP.create({
      email,
      otp,
      expiredAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    console.log(otp);
    await sendEmail(
      email,
      "Mã xác thực OTP BidZone",
      `Mã OTP của bạn là:\n\n${otp}\n\n Vui lòng không gửi hay chuyển tiếp mã này cho bất kì ai khác.`
    );

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message:
        "Failed to send OTP or failed to save OTP to database: " + err.message,
    });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Missing email or otp" });
  }

  try {
    const record = await OTP.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Xoá OTP sau khi dùng
    await OTP.deleteMany({ email });
    res.status(200).json({ message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ message: "Failed to verify OTP: " + err.message });
  }
};
