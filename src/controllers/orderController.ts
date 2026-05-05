import { Request, Response } from "express";
import Order from "../database/models/orderModel";
import OrderDetails from "../database/models/orderDetails";
import { PaymentMethod } from "../globals/types";
import Payment from "../database/models/paymentModel";

interface IProduct {
  productId: string;
  productQty: number;
}

interface OrderRequest extends Request {
  user?: {
    id: string;
  };
}

class OrderController {
  async createOrder(req: OrderRequest, res: Response) {
    try {
      const userId = req.user?.id;

      const { phoneNumber, shippingAddress, paymentMethod,totalAmount, products } = req.body;

      if (!phoneNumber || !shippingAddress || !totalAmount || !products || products.length === 0) {
        return res.status(400).json({
          message: "Please provide all required info",
        });
      }

      const orderData = await Order.create({
        phoneNumber,
        shippingAddress,
        totalAmount,
        UserId: userId,
      });

      for (const product of products) {
        await OrderDetails.create({
          quantity: product.productQty,
          ProductId: product.productId,
          OrderId: orderData.id,
        });
      }

      if (paymentMethod === PaymentMethod.COD) {
        await Payment.create({
          OrderId: orderData.id,
          paymentMethod,
        });
      }

      return res.status(201).json({
        message: "Order created successfully",
        order: orderData,
      });

    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
}

export default new OrderController();