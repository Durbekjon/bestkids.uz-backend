import connect from './config/dbConfig.js'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()
const app = express()

app.use(cors('*'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

import awsImgRouter from './services/upload/aws/imageRoute.js'
import imageRouter from './routes/imageRoute.js'
import authRouter from './routes/authRoute.js'

app.use('/api/aws-image', awsImgRouter)
app.use('/api/image', imageRouter)
app.use('/api/auth', authRouter)

const port = process.env.PORT || 3000

app.listen(port, () => {
    connect()
    console.log('Sevrer listening on http://localhost:' + port)
})
