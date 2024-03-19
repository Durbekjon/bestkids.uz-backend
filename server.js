import client from './config/redisConfig.js'
import connect from './config/dbConfig.js'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
const app = express()
dotenv.config()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors('*'))

import cloudinaryImgRouter from './services/upload/cloudinary/imageRoute.js'
import awsImgRouter from './services/upload/aws/imageRoute.js'
import categoryRoute from './routes/categoriesRoute.js'
import feedbackRoute from './routes/feedbackRoute.js'
import programRoute from './routes/programRoute.js'
import imageRouter from './routes/imageRoute.js'
import authRouter from './routes/authRoute.js'
import teamRouter from './routes/teamRoute.js'

app.use('/api/cloudinary-image', cloudinaryImgRouter)
app.use('/api/aws-image', awsImgRouter)
app.use('/api/feedback', feedbackRoute)
app.use('/api/category', categoryRoute)
app.use('/api/program', programRoute)
app.use('/api/image', imageRouter)
app.use('/api/team', teamRouter)
app.use('/api/auth', authRouter)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('Sevrer listening on http://localhost:' + port)
    connect()
    client
})
