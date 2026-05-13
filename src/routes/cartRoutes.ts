import express,{ Router } from "express";
import UserMiddleware, { Role } from "../middleware/UserMiddleware";
import errorHandler from "../services/errorHandler";
import CartController from "../controllers/cartController";

const router:Router=express.Router()

router.route("/").post(UserMiddleware.isUserLoggedIn,UserMiddleware.restrictTo(Role.Admin,Role.Customer),errorHandler(CartController.addToCart)).get(UserMiddleware.isUserLoggedIn,UserMiddleware.restrictTo(Role.Customer),errorHandler(CartController.getMyCartItems))

router.route("/:productId").delete(UserMiddleware.isUserLoggedIn,UserMiddleware.restrictTo(Role.Customer),errorHandler(CartController.deleteMyCartItem)).patch(UserMiddleware.isUserLoggedIn,UserMiddleware.restrictTo(Role.Customer),errorHandler(CartController.updateCartItem))


export default router