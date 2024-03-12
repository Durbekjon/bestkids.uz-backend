import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connect from './config/dbConfig.js'

const app = express()
dotenv.config()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors('*'))

import authRouter from './routes/authRoute.js'
import ImageRouter from './routes/imageRoute.js'

app.use('/api/auth', authRouter)
app.use('/api/image', ImageRouter)
const port = process.env.PORT || 3000

app.listen(port, () => {
    connect()
    console.log('Sevrer listening on http://localhost:' + port)
})
