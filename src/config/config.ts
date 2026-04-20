import { config } from "dotenv"
config()
export const envConfig={
    port:process.env.PORT,
    connection_string:process.env.CONNECTION_STRING
}