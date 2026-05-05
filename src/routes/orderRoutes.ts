import express,{Router} from 'express'
import orderController from '../controllers/orderController'
import UserMiddleware from '../middleware/UserMiddleware'
import errorHandler from '../services/errorHandler'
const router:Router =express.Router()

router.route("/").post(UserMiddleware.isUserLoggedIn,errorHandler(orderController.createOrder))

export default router

