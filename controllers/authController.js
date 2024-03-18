import User from '../models/User.js'
import Image from '../models/Image.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { errorHandler, notFound } from './responsController.js'

const register = async (req, res) => {
    try {
        let { name, phone, email, password, social, image } = req.body
        let user = await User.findOne({ phone })
        if (user) {
            return res.status(403).json({
                message: 'Access denied: User already registered',
                success: false,
            })
        }
        // Hash the password correctly
        password = await bcrypt.hash(password, 10)
        user = new User({ name, phone, email, password, social, image })
        await user.save()
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d',
            },
        )

        const response = {
            message: 'User registered successfully',
            data: {
                id: user.id,
                phone: user.phone,
                email: user.email,
                social: user.social,
            },
            token,
            success: true,
        }

        await Image.findByIdAndUpdate(image, { for: 'user' })

        return res.status(200).json(response)
    } catch (error) {
        errorHandler(res, error)
    }
}

const login = async (req, res) => {
    try {
        const { phone, email, password } = req.body

        if (!phone || !email || !password) {
            return res.status(400).json({
                message: 'Phone, email, and password are required',
                success: false,
            })
        }

        const user =
            (await User.findOne({ phone })) || (await User.findOne({ email }))

        if (!user) {
            return notFound(res, 'User')
        }

        const passwordMatches = await bcrypt.compare(password, user.password)
        if (!passwordMatches) {
            return res.status(403).json({
                message: "Acccess denied: Password didn't match",
                success: false,
            })
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d',
            },
        )
        console.log(user)
        const response = {
            message: 'User logged in successfully',
            data: {
                id: user.id,
                phone: user.phone,
                email: user.email,
                social: user.social,
            },
            token,
            success: true,
        }

        return res.status(200).json(response)
    } catch (error) {
        errorHandler(res, error)
    }
}

export { register, login }
