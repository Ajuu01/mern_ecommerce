import { Request,Response } from "express";
import User from "../database/models/userModel"

class userController{
    static async Register(req:Request,res:Response){
        const {username,email,password}=req.body

        if(!username || !email || !password){
            res.status(400).json({
                message:"Please provide all information"
            })
            return
        }

        const user=await User.create({
            username,
            email,
            password,
        })
        res.status(200).json({
            message:"User registered successfully!!"
        })
    }

}

export default userController