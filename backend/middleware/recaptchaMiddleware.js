import axios from "axios";

export const verifyRecaptcha = async (req, res, next) => {
  const { recaptcha } = req.body;
  if (!recaptcha) {
    return res.status(400).json({ message: "Recaptcha token is required" });
  }

  //Verify recaptcha with Google
  const recaptchaVerifyURL = process.env.CAPTCHA_VERIFY_URL;
  try {
    const recaptchaResponse = await axios.post(
      recaptchaVerifyURL,
      {},
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptcha,
        },
      }
    );

    if (!recaptchaResponse.data.success) {
      return res.status(400).json({ message: "Recaptcha validation failed" });
    }
    next();
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Recaptcha verification error " + err.message });
  }
};
