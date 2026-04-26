import express from 'express'
import userRouter from './routes/userRoutes'
import categoryRoute from './routes/categoryRoutes'

const app=express()
import './database/connection'
app.use(express.json());

app.use('/api/auth',userRouter)
app.use('/api/category',categoryRoute)

export default app