import express, { Router } from "express"
import categoryController from "../controllers/categoryController"
import UserMiddleware from "../middleware/UserMiddleware"

const router:Router=express.Router()

router.route('/').get(categoryController.getCategory).post(UserMiddleware.isUserLoggedIn, categoryController.addCategory)
router.route("/:id").patch(categoryController.updateCategory).delete(categoryController.deleteCategory)

export default router