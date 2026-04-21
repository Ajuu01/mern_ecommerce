import { Sequelize } from "sequelize-typescript"
import { envConfig } from "../config/config"

const sequelize=new Sequelize(envConfig.connection_string as string,{
    models:[__dirname+'/models']
})

sequelize.sync({force : false,alter:false}).then(()=>{
    console.log("synced !!")
})

try{
    sequelize.authenticate()
    .then(()=>{
        console.log("Password is authenticated successfully!1")
    })
    .catch(err=>{
        console.log("error in authentication",err)
    })
}catch(error){
    console.log(error)
}
