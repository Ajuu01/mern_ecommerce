import { Request,Response } from "express";
import Product from "../database/models/productModel";
import Category from "../database/models/categoryModel";

import fs from 'fs'
import path from 'path'

// interface ProductRequest extends Request{
//     file?:{
//         filename:string,
//         fieldname:string,
//     },
// }

class productController{
    static async addProduct(req:Request, res:Response){
        const {productName,productDescription,productPrice,productTotalStock,discount,CategoryId}=req.body
        const fileName=req.file?req.file.filename:"https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?semt=ais_hybrid&w=740&q=80"
        if(!productName || !productDescription || !productPrice || !productTotalStock || !CategoryId ){
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

    static async getAllProducts(req:Request,res:Response){
        const datas=await Product.findAll({
            include:[{
                model:Category,
                attributes:['id','categoryName']
            }]
        })
        res.status(200).json({
            message:"All products fetched!!",
            datas
        })
    }
    static async getSingleProduct(req:Request,res:Response){
        const {id}=req.params
        const data=await Product.findAll({
            where:{
                id:id
            },
            include:[{
                model:Category,
                attributes:['id','categoryName']
            }]
        })
        res.status(200).json({
            message:"Single product fetched!!",
            data
        })
    }

    static async deleteProduct(req:Request,res:Response){
        const { id } = req.params;

        const product = await Product.findOne({
            where: { id }
        });

        if (!product) {
            return res.status(404).json({
                message: "No product with such id"
            })
        }

        if (product.productImageUrl && !product.productImageUrl.startsWith("http")) {
            const imagePath = path.join(__dirname, "../uploads/", product.productImageUrl)

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Product.destroy({
            where: { id }
        })

        res.status(200).json({
            message: "Product deleted successfully!"
        })
    }
    static async updateProduct(req: Request, res: Response) {
        const { id } = req.params;
        const { productName, productDescription, productPrice, productTotalStock, discount, CategoryId } = req.body;

        const product = await Product.findOne({ where: { id } });

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        let newImage = product.productImageUrl;

        if (req.file) {
            newImage = req.file.filename;

            if (product.productImageUrl && !product.productImageUrl.startsWith("http")) {
                const oldImagePath = path.join(__dirname, "../uploads/", product.productImageUrl);

                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        await Product.update({
            productName,
            productDescription,
            productPrice,
            productTotalStock,
            discount: discount || 0,
            CategoryId,
            productImageUrl: newImage
        }, {
            where: { id }
        });

        res.status(200).json({
            message: "Product updated successfully!"
        });
    }
}

export default productController