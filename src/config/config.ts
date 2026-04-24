import { config } from "dotenv"
config()
export const envConfig={
    port:process.env.PORT,
    connection_string:process.env.CONNECTION_STRING,
    jwt_secret_key:process.env.JWT_SECRET_KEY as string,
    jwt_expires_in:process.env.JWT_EXPIRES_IN as string,
    email:process.env.EMAIL,
    emain_pass:process.env.EMAIL_PASS,
    admin_email:process.env.ADMIN_EMAIL,
    admin_password:process.env.ADMIN_PASSWORD,
    admin_username:process.env.ADMIN_USERNAME
}