import express, { Router } from "express";
import userController from "../controllers/userController";

const userRouter:Router=express.Router()

userRouter.route("/register").post(userController.Register)
userRouter.route("/login").post(userController.Login)

export default userRouter