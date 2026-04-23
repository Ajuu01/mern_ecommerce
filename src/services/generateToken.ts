import jwt from "jsonwebtoken"
import { envConfig } from "../config/config"

const generateToken=(userId:string)=>{
    const token=jwt.sign({userId:userId},envConfig.jwt_secret_key,{
        expiresIn:envConfig.jwt_expires_in as any
    })
    return token 
}

export default generateToken