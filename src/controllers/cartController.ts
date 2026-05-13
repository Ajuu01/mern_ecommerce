import { json, Request,Response } from "express";
import Cart from "../database/models/cartModel";
import Product from "../database/models/productModel";

interface AuthRequest extends Request{
    user?:{
        id:string
    }
}
class CartController{
    static async addToCart(req:AuthRequest,res:Response){
        const userId=req.user?.id
        const {productId,quantity}=req.body
        if(!productId || !quantity){
            res.status(400).json({
                message:"Please provide productId and quantity"
            })
            return
        }
        let cartOfUser=await Cart.findOne({
            where:{
                ProductId:productId,
                UserId:userId
            }
        })
        if(cartOfUser){
            cartOfUser.quantity+=quantity
            await cartOfUser.save()
        }
        await Cart.create({
            UserId:userId,
            ProductId:productId,
            quantity
        })
        res.status(200).json({
            message:"Product added to cart"
        })
    }
    static async getMyCartItems(req:AuthRequest,res:Response){
        const userId=req.user?.id
        const cartItems=await Cart.findAll({
            where:{
                UserId:userId
            },
            include:[
                {
                    model:Product,
                    attributes:['id','productName','productPrice','productImageUrl']
                }
            ]
        })
        if(cartItems.length===0){
            res.status(404).json({
                message:"No items in the cart"
            })
        }else{
            res.status(200).json({
                message:"cart fetched successfully",
                data:cartItems
            })
        }
    }
    static async deleteMyCartItem(req:AuthRequest,res:Response){
        const userId=req.user?.id
        const {productId}=req.params
        const product=await Product.findByPk(productId as string)

        if(!product){
            res.status(404).json({
                message:"No product with that id"
            })
            return
        }
        await Cart.destroy({
            where:{
                ProductId:productId,
                UserId:userId
            }
        })
        res.status(200).json({
            message:"Cart item deleted successfully"
        })
    }
    static async updateCartItem(req:AuthRequest,res:Response){
        const userId=req.user?.id
        const {productId}=req.params
        const {quantity}=req.body

        if(!quantity){
            res.status(400).json({
                message:"please provide quantity"
            })
            return
        }
        const cartItem=await Cart.findOne({
            where:{
                UserId:userId,
                ProductId:productId
            }
        })
        if(!cartItem){
            res.status(404).json({
                message:"No such product"
            })
            return
        }
        cartItem.quantity=quantity
        await cartItem.save()
        res.status(200).json({
                message:"Cart updated successfully!!"
            })
    }
}

export default CartController