import { NextFunction, Request,Response, } from "express";
import sendResponse from "../services/sendResponse";
import jwt from 'jsonwebtoken'
import { envConfig } from "../config/config";

class UserMiddleware{
    async isUserLoggedIn(req:Request,res:Response,next:NextFunction):Promise<void>{
        const token=req.headers.authorization
        if(!token){
            sendResponse(res,400,"You aren't logged in")
            return
        }
        jwt.verify(token,envConfig.jwt_secret_key as string,async(err,result)=>{
            if(err){
                sendResponse(res,403,"Invalid Token")
            }else{
                console.log(result)
                next()
            }
        })

    }
}

export default new UserMiddleware