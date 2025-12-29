import express from "express";
import{
  registerSchema,
  loginSchema,
  emailSchema
} from "../schemas/AuthSchema.js";
import { validate } from "../middleware/validateMiddleware.js";
import {
  register,
  login,
  logout,
  refresh,
  checkEmail,
  oauthSuccess,
  resetPassword,
} from "../controllers/authController.js";
import { verifyRecaptcha } from "../middleware/recaptchaMiddleware.js";
import passport from "../config/passport.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", authenticate, (req, res) => {
  res.status(200).json(req.user);
});
router.post("/register", validate({body: registerSchema}), verifyRecaptcha, register);
router.post("/login", validate({body: loginSchema}), verifyRecaptcha, login);
router.post("/logout", logout);
router.get("/refresh", refresh);
router.post("/check-email", validate({body: emailSchema}), checkEmail);

// GOOGLE
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  oauthSuccess
);

// FACEBOOK
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  oauthSuccess
);

// Github
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  oauthSuccess
);

router.post("/reset-password", validate({body: emailSchema}), resetPassword);

export default router;
