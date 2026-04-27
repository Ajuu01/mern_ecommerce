import express, { Router } from "express";
import userController from "../controllers/userController";
import errorHandler from "../services/errorHandler";

const userRouter:Router=express.Router()

userRouter.route("/register").post(errorHandler(userController.Register))
userRouter.route("/login").post(errorHandler(userController.Login))
userRouter.route("/forgotPassword").post(errorHandler(userController.handleForgotPassword))
userRouter.route("/verifyOtp").post(errorHandler(userController.verifyOtp))
userRouter.route("/resetPassword").post(errorHandler(userController.resetPassword))

export default userRouter