import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dns from "dns";

import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import connectCloudinary from "./configs/cloudinary.js";

dns.setDefaultResultOrder("ipv4first");

const app = express();

connectCloudinary();

// DB CONNECTION
let isConnected = false;

const connectToMongoDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URL);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.log("MongoDB error:", err);
  }
};

connectToMongoDB();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "https://greencart-iota-one.vercel.app",
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("API is working");
});

app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

export default app;
