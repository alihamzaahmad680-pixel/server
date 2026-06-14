import express from "express";
import {
  isAuth,
  login,
  register,
  logout,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";

const userRouter = express.Router();

userRouter.post("/login", login);

userRouter.post("/register", register);

userRouter.get("/is-auth", authUser, isAuth);

userRouter.get("/logout", authUser, logout);

export default userRouter;
