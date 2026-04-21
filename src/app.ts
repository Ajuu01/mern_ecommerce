import express from 'express'
import userRouter from './routes/userRoutes'

const app=express()
import './database/connection'
app.use(express.json());

app.use('/api/auth',userRouter)

export default app