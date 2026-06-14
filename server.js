import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./configs/db.js";

import dns from "dns";

import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import mongoose from "mongoose";

dns.setDefaultResultOrder("ipv4first");

const app = express();
const port = process.env.PORT || 4000;

connectCloudinary();
connectDB();

const allowedOrigins = ["http://localhost:5173"];

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get("/", (req, res) => res.send("API is working"));

app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

let isConnected = false;
try{
async function connectToMongoDB() {
  await mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifieldTopology:true
  });
  isConnected = true;
  console.log("connected to database");
  
}catch(error){
  console.log("error connecting to mongoDB:", error);
  
}
}

app.use((req,res,next) =>{
  if(!isConnected){
    connectTOMongoDB();
  }
  next();
})

module.exports = app
















// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
