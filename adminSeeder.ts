import { envConfig } from "./src/config/config"
import User from "./src/database/models/userModel"
import bcrypt from "bcrypt"

const adminSeeder=async()=>{
    const [data]=await User.findAll({
        where:{
            email:envConfig.admin_email
        }
    })
    if(!data){
        await User.create({
            username:envConfig.admin_username,
            email:envConfig.admin_email,
            password:bcrypt.hashSync(envConfig.admin_password as string,12),
            role:"admin"
        })
        console.log("Admin seeded!!")
    }else{
        console.log("Admin already seeded!")
    }
}

export default adminSeeder