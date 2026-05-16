import * as otpService from "../services/otpServices.js";

export const sendOTP = async (req, res) => {
  try {
    await otpService.generateAndSendOTP(req.body.email);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(error.message === "Missing email" ? 400 : 500).json({ message: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    await otpService.verifyOTP(email, otp);
    res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(error.message === "Missing email or otp" ? 400 : error.message === "Invalid or expired OTP" ? 400 : 500).json({ message: error.message });
  }
};
