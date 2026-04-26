import Category from "../database/models/categoryModel"
import { Request,Response } from "express"
import sendResponse from "../services/sendResponse"

class categoryController{
    static categoryData=[
        {
            categoryName:"Electronics"
        },
        {
            categoryName:"Groceries"
        },
        {
            categoryName:"Foods"
        }
    ]
     static async seedCategory():Promise<void>{
        const data=await Category.findAll()
        if(data.length==0){
            await Category.bulkCreate(this.categoryData)
            console.log("Category table seeded successfully")
        }else{
            console.log("Already seeded")
        }
    }
    static async addCategory(req:Request,res:Response){
        const {categoryName}=req.body
        if(!categoryName){
            sendResponse(res,400,"Please provide category name!!")
            return
        }
        const [category]=await Category.findAll({
            where:{
                categoryName:categoryName
            }
        })
        if(category){
            res.status(400).json({
                message:"This category already exists"
            })
            return
        }
        await Category.create({
            categoryName
        })
        sendResponse(res,200,"Category added successfully!!")
    }
    static async getCategory(req:Request,res:Response){
        const data=await Category.findAll()
        res.status(200).json({
            message:"Categories fetched successfully",
            data:data
        })
    }
    static async deleteCategory(req:Request,res:Response){
        const {id}=req.params
        if(!id){
            sendResponse(res,400,"Please provide id")
            return
        }
        const data=await Category.findAll({
            where:{
                id:id
            }
        })
        // const fata=await Category.findByPk(id)
        if(!data){
            sendResponse(res,400,"No category with such id")
        }else{
            await Category.destroy({
                where:{
                    id:id
                }
            })
            sendResponse(res,200,"Category deleted successfully")
        }
    }
    static async updateCategory(req:Request,res:Response){
        const {id}=req.params
        const {newCategoryName}=req.body
        if(!id || !newCategoryName){
            sendResponse(res,400,"Please provide id and new category name")
            return
        }
        const [data]=await Category.findAll({
            where:{
                id:id
            }
        })
        // const fata=await Category.findByPk(id)
        if(!data){
            sendResponse(res,400,"No category with such id")
        }else{
            await Category.update({
                categoryName:newCategoryName
                },{
                where:{
                    id
                }
            })
            sendResponse(res,200,"Category updated successfully")
        }
    }
}

export default categoryController