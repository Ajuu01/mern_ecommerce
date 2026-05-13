import { Sequelize } from "sequelize-typescript"
import { envConfig } from "../config/config"
import Product from "./models/productModel"
import Category from "./models/categoryModel"
import Order from "./models/orderModel"
import User from "./models/userModel"
import Payment from "./models/paymentModel"
import OrderDetails from "./models/orderDetails"
import Cart from "./models/cartModel"


const sequelize=new Sequelize(envConfig.connection_string as string,{
    models: [__dirname+'/models']
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

Product.belongsTo(Category)
Category.hasOne(Product)

// User x Order
Order.belongsTo(User)
User.hasMany(Order)

// Payment x Order
Payment.belongsTo(Order)
Order.hasOne(Payment)

// Order x OrderDetails
OrderDetails.belongsTo(Order)
Order.hasOne(OrderDetails)

// Product x OrderDetails
OrderDetails.belongsTo(Product)
Product.hasMany(OrderDetails)

// User x Cart
User.hasOne(Cart)
Cart.belongsTo(User)

// Product x Cart
Product.hasMany(Cart)
Cart.belongsTo(User)


export default sequelize