import express from 'express'
import userRouter from './routes/userRoutes'
import categoryRoute from './routes/categoryRoutes'
import productRoute from './routes/productRoutes'
import orderRoute from './routes/orderRoutes'

const app=express()
import './database/connection'
app.use(express.json());

app.use('/api/auth',userRouter)
app.use('/api/category',categoryRoute)
app.use('/api/product',productRoute)
app.use('/api/order',orderRoute)

export default app