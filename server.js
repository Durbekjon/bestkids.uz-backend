import connect from './config/dbConfig.js'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import client from './config/redisConfig.js'
dotenv.config()
const app = express()

app.use(cors('*'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

import cloudinaryImgRouter from './services/upload/cloudinary/imageRoute.js'
import awsImgRouter from './services/upload/aws/imageRoute.js'
import programRoute from './routes/programRoute.js'
import imageRouter from './routes/imageRoute.js'
import authRouter from './routes/authRoute.js'
import teamRouter from './routes/teamRoute.js'

app.use('/api/cloudinary-image', cloudinaryImgRouter)
app.use('/api/aws-image', awsImgRouter)
app.use('/api/program', programRoute)
app.use('/api/image', imageRouter)
app.use('/api/team', teamRouter)
app.use('/api/auth', authRouter)

const port = process.env.PORT || 3000

app.listen(port, () => {
    connect()
    client
    console.log('Sevrer listening on http://localhost:' + port)
})
