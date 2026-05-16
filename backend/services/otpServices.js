import OTP from "../models/otpModel.js";
import { sendEmail } from "./mailServices.js";

export const generateAndSendOTP = async (email) => {
  if (!email) throw new Error("Missing email");

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 số
  
  await OTP.create({
    email,
    otp,
    expiredAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
          <h1 style="text-align: center; color: #667eea;">Mã Xác Thực OTP - BidZone</h3>
          <p style="font-size: 16px; color: #333;">Chào bạn,</p>
          <p style="font-size: 16px; color: #333;">
            Mã OTP của bạn là:<br><strong style="font-size: 24px; color: #667eea;">${otp}</strong>
          </p>
          <p style="font-size: 16px; color: #333;">
            Vui lòng nhập mã này vào hệ thống để xác thực tài khoản của bạn. Mã OTP này chỉ có hiệu lực trong vòng 5 phút.
          </p>
          <p style="font-size: 16px; color: #333;">
            <b>Lưu ý:</b> Vui lòng không chia sẻ mã OTP với bất kỳ ai. Nếu bạn không yêu cầu mã OTP này, xin vui lòng bỏ qua email này.
          </p>
          <div style="text-align: center; margin-top: 30px;">
            <p style="font-size: 14px; color: #888;">Cảm ơn bạn đã sử dụng dịch vụ của BidZone.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail(email, "Mã xác thực OTP BidZone", html);
  return { email };
};

export const verifyOTP = async (email, otp) => {
  if (!email || !otp) throw new Error("Missing email or otp");

  const record = await OTP.findOne({ email, otp });

  if (!record) {
    throw new Error("Invalid or expired OTP");
  }

  // Xoá OTP sau khi dùng
  await OTP.deleteMany({ email });
  return true;
};



