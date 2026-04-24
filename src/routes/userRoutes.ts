import express, { Router } from "express";
import userController from "../controllers/userController";

const userRouter:Router=express.Router()

userRouter.route("/register").post(userController.Register)
userRouter.route("/login").post(userController.Login)
userRouter.route("/forgotPassword").post(userController.handleForgotPassword)
userRouter.route("/verifyOtp").post(userController.verifyOtp)
userRouter.route("/resetPassword").post(userController.resetPassword)

export default userRouter