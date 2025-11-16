import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

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
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
app.use("/api/orders", orderRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/upgrade", upgradeRoutes);
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

