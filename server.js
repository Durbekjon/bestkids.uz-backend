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
import categoryRouter from './routes/categoriesRoute.js'
import feedbackRouter from './routes/feedbackRoute.js'
import programRouter from './routes/programRoute.js'
import imageRouter from './routes/imageRoute.js'
import authRouter from './routes/authRoute.js'
import teamRouter from './routes/teamRoute.js'
import courseRouter from './routes/coursesRoute.js'

app.use('/api/cloudinary-image', cloudinaryImgRouter)
app.use('/api/feedback', feedbackRouter)
app.use('/api/category', categoryRouter)
app.use('/api/aws-image', awsImgRouter)
app.use('/api/program', programRouter)
app.use('/api/course', courseRouter)
app.use('/api/image', imageRouter)
app.use('/api/team', teamRouter)
app.use('/api/auth', authRouter)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('Sevrer listening on http://localhost:' + port)
    connect()
    client
})
