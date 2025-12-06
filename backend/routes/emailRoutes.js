import express from "express";
import dotenv from "dotenv";
import { verifyBecomeSeller } from "../controllers/emailController.js";

dotenv.config();

const router = express.Router();

// Send verification email
router.post("/becomeSeller", verifyBecomeSeller);

export default router;
