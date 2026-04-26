import { Request,Response } from "express";
import Product from "../database/models/productModel";
import Category from "../database/models/categoryModel";

interface ProductRequest extends Request{
    file?:{
        filename:string
    },
}

class productController{
    static async addProduct(req:ProductRequest, res:Response){
        const {productName,productDescription,productPrice,productTotalStock,discount,CategoryId}=req.body
        const fileName=req.file?req.file.filename:"https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?semt=ais_hybrid&w=740&q=80"
        if(!productName || !productDescription || !productPrice || !productTotalStock || CategoryId ){
            res.status(400).json({
                message:"Please provide name, description, price, total stock, CategoryId and image url for price!"
            })
            return
        }

        await Product.create({
            productName,
            productDescription,
            productPrice,
            productTotalStock,
            discount:discount || 0,
            CategoryId,
            productImageUrl:fileName
        })
        res.status(200).json({
            message:"Product created successfully!!"
        })
    }

    static async getAllProducts(req:ProductRequest,res:Response){
        const [datas]=await Product.findAll({
            include:[{
                model:Category
            }]
        })
        res.status(200).json({
            message:"All products fetched!!",
            datas
        })
    }
    static async getSingleProduct(req:ProductRequest,res:Response){
        const {id}=req.params
        const data=await Product.findAll({
            where:{
                id:id
            },
            include:[{
                model:Category
            }]
        })
        res.status(200).json({
            message:"Single product fetched!!",
            data
        })
    }

    static async deleteProduct(req:ProductRequest,res:Response){
        const {id}=req.params
        const data=await Product.findAll({
            where:{
                id:id
            }
        })
        if(data.length==0){
            res.status(400).json({
                message:"No product with such id"
            })
        }else{
            await Product.destroy({
                where:{
                    id:id
                }
            })
            res.status(200).json({
                message:"Product Deleted Successfully!!",
                data
            })
        }
    }
}

export default productController