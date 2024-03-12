import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import connect from './config/dbConfig.js'

dotenv.config()
const app = express()

app.use(cors('*'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

import authRouter from './routes/authRoute.js'
import imageRouter from './routes/imageRoute.js'
import classRouter from './routes/classesRoute.js'
import categoryRouter from './routes/categoryRoute.js'

app.use('/api/auth', authRouter)
app.use('/api/image', imageRouter)
app.use('/api/classes', classRouter)
app.use('/api/category', categoryRouter)

const port = process.env.PORT || 3000

app.listen(port, () => {
    connect()
    console.log('Sevrer listening on http://localhost:' + port)
})
