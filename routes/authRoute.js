import express from 'express'
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const router = express.Router()

router.post('/register', async (req, res) => {
    try {
        let { phone_number, password } = req.body
        let user = await User.findOne({ phone_number })
        if (user) {
            return res.status(403).json({
                message: 'Access denied: User already registered',
                success: false,
            })
        }
        // Hash the password correctly
        password = await bcrypt.hash(password, 10)
        user = new User({ phone_number, password })
        await user.save()
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        })

        return res.status(200).json({
            message: 'User registered successfully',
            data: user,
            token,
            success: true,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error.message,
            success: false,
        })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { phone_number, password } = req.body
        const user = await User.findOne({ phone_number })

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false,
            })
        }

        const passwordMatches = await bcrypt.compare(password, user.password)
        if (!passwordMatches) {
            return res.status(403).json({
                message: "Acccess denied: Password didn't match",
                success: false,
            })
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        })

        return res.status(200).json({
            message: 'User logged in successfully',
            data: user,
            token,
            success: true,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error.message,
            success: false,
        })
    }
})

export default router
