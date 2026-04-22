import { Request,Response } from "express";
import User from "../database/models/userModel"
import bcrypt from 'bcrypt'

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
            password:bcrypt.hashSync(password,10),
        })
        res.status(200).json({
            message:"User registered successfully!!"
        })
    }
    static async Login(req:Request,res:Response){
        const {email,password}=req.body
        if(!email || !password){
            res.status(200).json({
                message:"Please provide email and password"
            })
            return
        }

        const [user]=await User.findAll({
            where:{
                email:email
            }
        })

        if(!user){
            res.status(200).json({
                message:"No user with that email found"
            })
        }else{
            const isEqual=bcrypt.compareSync(password,user.password)
            if(!isEqual){
                res.status(400).json({
                    message:"Incorrect Password"
                })
            }else{
                res.status(200).json({
                    message:"Logged in successfully"
                })
            }
        }
    }
}

export default userController