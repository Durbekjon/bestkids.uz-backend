import { transporter } from '../config/emailConfig.js'
import { errorHandler } from './responsController.js'
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
const sendVerCode = (email) => {
    try {
        const code = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000

        transporter.sendMail({
            from: process.env.USER_EMAIL,
            to: email,
            subject: 'User verification code',
            text: `Your verification code - ${code}`,
        })

        return code
    } catch (error) {
        const res = express.response
        return errorHandler(res, error)
    }
}

export default sendVerCode
