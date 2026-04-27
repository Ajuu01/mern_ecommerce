import express, { Router } from "express"
import categoryController from "../controllers/categoryController"
import UserMiddleware, { Role } from "../middleware/UserMiddleware"
import errorHandler from "../services/errorHandler"

const router:Router=express.Router()

router.route('/').get(errorHandler(categoryController.getCategory)).post(UserMiddleware.isUserLoggedIn,UserMiddleware.restrictTo(Role.Admin),errorHandler(categoryController.addCategory))
router.route("/:id").patch(UserMiddleware.isUserLoggedIn,UserMiddleware.restrictTo(Role.Admin),errorHandler(categoryController.updateCategory)).delete(UserMiddleware.isUserLoggedIn,UserMiddleware.restrictTo(Role.Admin),errorHandler(categoryController.deleteCategory))

export default router