import adminSeeder from "./adminSeeder"
import app from "./src/app"
import { envConfig } from "./src/config/config"
import categoryController from "./src/controllers/categoryController"

function startServer(){
    const port=envConfig.port || 4000
    adminSeeder()
    categoryController.seedCategory()
    app.listen(port,()=>{
        console.log(`Server has started at port[${port}]!!`)
    })
}
startServer()


