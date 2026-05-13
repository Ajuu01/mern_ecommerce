import { Request, Response } from "express";
import Order from "../database/models/orderModel";
import OrderDetails from "../database/models/orderDetails";
import { PaymentMethod, PaymentStatus } from "../globals/types";
import Payment from "../database/models/paymentModel";
import axios from "axios";

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
  static async createOrder(req: OrderRequest, res: Response) {
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
      const paymentData=await Payment.create({
          OrderId: orderData.id,
          paymentMethod,
        });
      if(paymentMethod===PaymentMethod.COD){
          paymentData.pidx="cod_"+orderData.id
          paymentData.save()
      }
      else if(paymentMethod==PaymentMethod.Khalti){
        const data={
          return_url:"http://localhost:5173/",
          website_url:"http://localhost:5173/",
          amount:totalAmount*100,
          purchase_order_id:orderData.id,
          purchase_order_name:"order_"+orderData.id
        }
        const response=await axios.post("https://dev.khalti.com/api/v2/epayment/initiate/",data,{
          headers : {
            Authorization:"Key 8080290a7c924e598658a22974430158"
          }
        })
        const khaltiResponse=response.data
        console.log(khaltiResponse)
        paymentData.pidx=khaltiResponse.pidx
        paymentData.save()
        return res.status(200).json({
          message: "Order created successfully",
          url:khaltiResponse.payment_url
        });
      }else{

      }

      

    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
  static async verifyTransaction(req:Request,res:Response):Promise<void>{
    const {pidx}=req.body
    if(!pidx){
      res.status(400).json({
        message:"Please provide pidx"
      })
      return
    }
    const response=await axios.post("https://dev.khalti.com/api/v2/epayment/lookup/",{
      pidx:pidx 
    },{
      headers:{
        Authorization:"Key 8080290a7c924e598658a22974430158"
      }
    })
    const data=response.data
    if(data.status==="Completed"){
      await Payment.update({paymentStatus:PaymentStatus.Paid},{
        where:{
          pidx:pidx
        }
      })
      res.status(200).json({
        message:"Payment verified successfully"
      })
    }else{
      res.status(400).json({
        message:"Payment unsuccessful"
      })
    }
  }
}

export default OrderController;