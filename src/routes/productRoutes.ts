import express, { Router } from 'express'
import productController from '../controllers/productController'
import UserMiddleware, { Role } from '../middleware/UserMiddleware'
import{multer,storage} from '../middleware/multerMiddleware'
import errorHandler from '../services/errorHandler'

const upload=multer({storage:storage})
const router:Router=express.Router()

router.route('/').get(errorHandler(productController.getAllProducts)).post(UserMiddleware.isUserLoggedIn,UserMiddleware.restrictTo(Role.Admin),upload.single("productImage") ,errorHandler(productController.addProduct))

router.route('/:id').delete(UserMiddleware.isUserLoggedIn,UserMiddleware.restrictTo(Role.Admin),upload.single("productUrl"),errorHandler(productController.deleteProduct)).get(errorHandler(productController.getSingleProduct)).patch(UserMiddleware.isUserLoggedIn,UserMiddleware.restrictTo(Role.Admin),upload.single('productImage'),errorHandler(productController.updateProduct))

export default router