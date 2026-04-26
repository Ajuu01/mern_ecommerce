import express, { Router } from "express"
import categoryController from "../controllers/categoryController"
import UserMiddleware, { Role } from "../middleware/UserMiddleware"

const router:Router=express.Router()

router.route('/').get(categoryController.getCategory).post(UserMiddleware.isUserLoggedIn,UserMiddleware.restrictTo(Role.Admin),categoryController.addCategory)
router.route("/:id").patch(UserMiddleware.isUserLoggedIn,UserMiddleware.restrictTo(Role.Admin),categoryController.updateCategory).delete(UserMiddleware.isUserLoggedIn,UserMiddleware.restrictTo(Role.Admin),categoryController.deleteCategory)

export default router