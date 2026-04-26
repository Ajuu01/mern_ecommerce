import { NextFunction, Request,Response, } from "express";
import sendResponse from "../services/sendResponse";
import jwt from 'jsonwebtoken'
import { envConfig } from "../config/config";
import User from "../database/models/userModel";

export enum Role{
    Admin='admin',
    Customer='customer'
}
interface IExtendedRequest extends Request{
    user?:{
        username:string,
        email:string,
        role:string,
        password:string,
        id:string
    }
}
class UserMiddleware{
    async isUserLoggedIn(req:IExtendedRequest,res:Response,next:NextFunction):Promise<void>{
        const token=req.headers.authorization
        if(!token){
            sendResponse(res,400,"You aren't logged in")
            return
        }
        jwt.verify(token,envConfig.jwt_secret_key as string,async(err,result:any)=>{
            if(err){
                sendResponse(res,403,"Invalid Token")
            }else{
                console.log(result)
                const userData=await User.findByPk(result.userId)
                if(!userData){
                    res.status(404).json({
                        message:"No user with that id"
                    })
                    return
                }
                req.user=userData 
                next()
            }
        })

    }
    restrictTo(...roles:Role[]){
        return(req:IExtendedRequest,res:Response,next:NextFunction)=>{
            let userRole=req.user?.role as Role
            if(!roles.includes(userRole)){
                console.log("Not an admin")
                res.status(400).json({
                    message:"Not an admin"
                })
                return
            }
            console.log(userRole,"Roles")
            next()   
        }
    }
}

export default new UserMiddleware