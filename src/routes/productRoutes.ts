import express, { Router } from 'express'
import productController from '../controllers/productController'
import UserMiddleware, { Role } from '../middleware/UserMiddleware'

const router:Router=express.Router()

router.route('/').get(productController.getAllProducts).post(UserMiddleware.isUserLoggedIn,UserMiddleware.restrictTo(Role.Admin) ,productController.addProduct)

router.route('/:id').delete(UserMiddleware.isUserLoggedIn,UserMiddleware.restrictTo(Role.Admin),productController.deleteProduct).patch(productController.getSingleProduct)

export default router