import { Response } from "express"
import sendResponse from "./sendResponse"

const checkOtpexpiration=(res:Response,otpGeneratedTime:string,thresholdTime:number)=>{
    const currentTime=Date.now()
    if(currentTime-parseInt(otpGeneratedTime)<=thresholdTime){
        sendResponse(res,200,"OTP verified.Please reset the password ")
    }else[
        sendResponse(res,403,"Invalid OTP")
    ]
}

export default checkOtpexpiration