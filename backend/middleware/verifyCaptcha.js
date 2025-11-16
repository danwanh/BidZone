import axios from "axios";

export const verifyCaptcha = async (req, res, captcha) => {
  if (!captcha) {
    return res.status(400).json({ message: "Captcha is required" });
  }

  //Verify captcha with Google
  const captchaVerifyURL = process.env.CAPTCHA_VERIFY_URL;

  const captchaResponse = await axios.post(
    captchaVerifyURL,
    {},
    {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: captcha,
      },
    }
  );

  return captchaResponse.data.success;
};
