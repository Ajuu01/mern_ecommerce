import express from 'express'
import userRouter from './routes/userRoutes'
import categoryRoute from './routes/categoryRoutes'
import productRoute from './routes/productRoutes'

const app=express()
import './database/connection'
app.use(express.json());

app.use('/api/auth',userRouter)
app.use('/api/category',categoryRoute)
app.use('/api/product',productRoute)

export default app