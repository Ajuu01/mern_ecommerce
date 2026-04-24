import { Request,Response } from "express";
import User from "../database/models/userModel"
import bcrypt from 'bcrypt'
import generateToken from "../services/generateToken";
import generateOtp from "../services/generateOtp";
import sendMail from "../services/sendMail";
import sendResponse from "../services/sendResponse";
import findDataByEmail from "../services/findDataByEmail";
import checkOtpexpiration from "../services/checkOtpExpiration";

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
                const token=generateToken(user.id)
                res.status(200).json({
                    message:"Logged in successfully",
                    token
                })
            }
        }
    }
    static async handleForgotPassword(req:Request,res:Response){
        const {email}=req.body
        if(!email){
            res.status(200).json({message:"Please provide email"})
            return 
        } 
        const [user]=await User.findAll({
            where:{
                email:email
            }
        }
        )
        if(!user){
            res.status(400).json({
                message:"Email not registered"
            })
            return
        }
        const otp=generateOtp()
        sendMail({
            to:email,
            subject:"Change Password",
            text:`Here is your otp ${otp}`
        })
        user.otp=otp.toString()
        user.otpGeneratedTime=Date.now().toString()
        await user.save()
        res.status(200).json({
            message:"Password Reset"
        })
    }
    static async verifyOtp(req:Request,res:Response){
        const {otp,email}=req.body
        if(!otp || !email){
            sendResponse(res,404,"Please provide with email and otp")
            return
        }
        const user=findDataByEmail(User,email)
        if(!user){
            sendResponse(res,404,"No user with such email!!")
            return
        }
        const [data]=await User.findAll({
            where:{
                email,
                otp
            }
        })
        if(!data){
            sendResponse(res,404,"Invalid OTP")
            return
        }
        const otpGeneratedTime=data.otpGeneratedTime
        checkOtpexpiration(res,otpGeneratedTime,120000)
    }
    static async resetPassword(req:Request,res:Response){
        const {newPassword,confirmPassword,email}=req.body
        if(!newPassword || !confirmPassword || !email){
            sendResponse(res,400,"Please provide new password")
            return
        }
        if(newPassword!==confirmPassword){
            sendResponse(res,400,"New password doesn't match confirm password")
            return
        }
        const user=await findDataByEmail(User,email)
        if(!user){
            sendResponse(res,404,"No user with such email")
            return
        }
        user.password=bcrypt.hashSync(newPassword,12)
        await user.save()
        sendResponse(res,200,"Password reset successfully")
    }
}

export default userController