import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import User from "./models/user.model.js";
// Import routes
import bidRoutes from "./routes/bidRoutes.js";
import autobidRoutes from "./routes/autobidRoutes.js"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("DB error:", err));
// Routes
app.use("/api/bids", bidRoutes);
app.use("/api/autobids", autobidRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

// import Product from './models/product.model.js';

// app.get('/', (req, res) => {
//   res.send("Hello from node api!");
// })

// app.post('/api/users', async (req,res) => {
//   try{
//     const user =  await User.create(req.body);
//     res.status(200).json(user);
//   }catch (error){
//     res.status(500).json({message: error.message})
//   }
// })

// app.post('/api/products', async (req,res) => {
//   try{
//     const product =  await Product.create(req.body);
//     res.status(200).json(product);
//   }catch (error){
//     res.status(500).json({message: error.message})
//   }
// })



