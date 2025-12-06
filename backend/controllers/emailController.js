import nodemailer from "nodemailer";

export const verifyBecomeSeller = async (req, res) => {
  console.log("BBBEEEE");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  // Create transporter
  const { email, last_name, code } = req.body;

  const mailOptions = {
    from: `"BTCAuction" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verification code",
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #3b3b3b;">
      <h1 style="color: #667eea; text-align: center;">Verify Your Email Address</h1>
      
      <p>Hello,</p>
      
      <p>Thank you ${last_name}! Please use the verification code below to complete your registration:</p>
      
      <div style="background-color: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
        <p style="margin: 0; font-size: 36px; font-weight: bold; letter-spacing: 6px; font-family: monospace;">${code}</p>
      </div>
      
      <p>If you didn't create an account, please ignore this email.</p>
      
      <p style="margin-top: 30px;">Best regards,<br><strong>BTCAuction</strong></p>
    </div>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
