import express, { Router } from 'express'
import productController from '../controllers/productController'
import UserMiddleware, { Role } from '../middleware/UserMiddleware'
import{multer,storage} from '../middleware/multerMiddleware'

const upload=multer({storage:storage})
const router:Router=express.Router()

router.route('/').get(productController.getAllProducts).post(UserMiddleware.isUserLoggedIn,UserMiddleware.restrictTo(Role.Admin),upload.single("productImage") ,productController.addProduct)

router.route('/:id').delete(UserMiddleware.isUserLoggedIn,UserMiddleware.restrictTo(Role.Admin),upload.single("productUrl"),productController.deleteProduct).get(productController.getSingleProduct).patch(UserMiddleware.isUserLoggedIn,UserMiddleware.restrictTo(Role.Admin),upload.single('productImage'),productController.updateProduct)

export default router