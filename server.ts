import { Server, Socket } from "socket.io"
import adminSeeder from "./adminSeeder"
import app from "./src/app"
import { envConfig } from "./src/config/config"
import categoryController from "./src/controllers/categoryController"
import jwt  from "jsonwebtoken"
import User from "./src/database/models/userModel"
import Order from "./src/database/models/orderModel"
import { orderStatus } from "./src/globals/types"

function startServer(){
    const port=envConfig.port || 4000
    const server=app.listen(port,()=>{
        adminSeeder()
        categoryController.seedCategory()
        console.log(`Server has started at port[${port}]!!`)
    })
    const io= new Server(server,{
        cors:{
            origin:"*"
        }
    })
    let onlineUsers:{socketId:string,userId:string,role:string}[]=[]
    let addToOnlineUsers=(socketId:string,userId:string,role:string)=>{
        onlineUsers = onlineUsers.filter(
        (user) => user.userId !== userId
        )

        onlineUsers.push({ socketId, userId, role })
                    console.log(onlineUsers)

    }
        
        io.on("connection",(socket)=>{
        const token=socket.handshake.headers.token //jwt
        if(token){
            jwt.verify(token as string,envConfig.jwt_secret_key as string,async(err:any,result:any)=>{
                if(err){
                    socket.emit("error",err)
                }else{
                    const userData=await User.findByPk(result.userId)
                    if(!userData){
                        socket.emit("error","No user found with that token")
                        return
                    }
                    addToOnlineUsers(socket.id,result.userId,userData.role)
                }
            })
        }else{
            socket.emit("error","Please provide token")
        }
        socket.on("updateOrderStatus",async (data)=>{
            const {status,orderId,userId}=data
            const findUser=onlineUsers.find(user=>user.userId == userId)
            await Order.update(
                {
                    orderStatus:status
                },
                {
                    where:{
                        id:orderId
                    }
                }
                    
            )
            if(findUser){                
                io.to(findUser.socketId).emit("success","Order status updated successfully")
            }else{
                socket.emit("error","user is not online")
            }
        })
    })
}


startServer()


