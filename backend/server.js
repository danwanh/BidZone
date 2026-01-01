import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";
import cron from "node-cron";

import User from "./models/user.model.js";
// Import routes
import bidRoutes from "./routes/bidRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import descriptionRoutes from "./routes/desRoutes.js";
import autobidRoutes from "./routes/autobidRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import upgradeRoutes from "./routes/upgradeRoutes.js";
import configRoutes from "./routes/configRoutes.js";

//authentication
import authRoutes from "./routes/authRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import passport from "./config/passport.js";

import auctionCronJob from "./config/autioncEndJob.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB error:", err));

// Routes
app.use("/api/bids", bidRoutes);
app.use("/api/autobids", autobidRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/descriptions", descriptionRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/product", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/config", configRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/upgrade", upgradeRoutes);

// Chuyển seller thành user
cron.schedule("0 * * * *", async () => {
  console.log("Đang quét các Seller hết hạn...");

  try {
    const now = new Date();
    const result = await User.updateMany(
      {
        role: "seller",
        seller_expires: { $lt: now },
      },
      {
        $set: {
          role: "bidder",
          seller_expires: null,
        },
      }
    );

    if (result.modifiedCount > 0) {
      console.log(
        ` Đã hạ cấp ${result.modifiedCount} người dùng từ Seller xuống Bidder.`
      );
    }
  } catch (err) {
    console.error("Lỗi Cron Job:", err);
  }
});

auctionCronJob.start();
//authentication
app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
