import axios from "axios";

export const verifyRecaptcha = async (req, res, recaptcha) => {
  if (!recaptcha) {
    return res.status(400).json({ message: "Captcha is required" });
  }

  //Verify recaptcha with Google
  const recaptchaVerifyURL = process.env.CAPTCHA_VERIFY_URL;

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

  return recaptchaResponse.data.success;
};
