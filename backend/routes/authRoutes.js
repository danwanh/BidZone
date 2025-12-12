import express from "express";
import {
  register,
  login,
  refresh,
  checkEmail,
  oauthSuccess,
  resetPassword
} from "../controllers/authController.js";
import { verifyRecaptcha } from "../middleware/recaptchaMiddleware.js";
import passport from "../config/passport.js";

const router = express.Router();

router.post("/register", verifyRecaptcha, register);
router.post("/login", verifyRecaptcha, login);
router.get("/refresh", refresh);
router.post("/check-email", checkEmail);

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

router.post("/reset-password", resetPassword);


export default router;
