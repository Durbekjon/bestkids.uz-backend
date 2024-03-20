import User from '../models/User.js'
import Image from '../models/Image.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {
    bad,
    defaultRes,
    deleted,
    errorHandler,
    notFound,
    updated,
} from './responsController.js'
import sendVerCode from './emailController.js'
import {
    cacheVerCode,
    checkUser,
    checkVerCode,
    verUser,
} from './redisController.js'

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

        if (!phone || !password) {
            return bad(res, 'Phone,  and password are')
        }

        const user =
            (await User.findOne({ phone })) || (await User.findOne({ email }))

        if (!user) {
            return notFound(res, 'User')
        }

        const passwordMatches = await bcrypt.compare(password, user.password)
        if (!passwordMatches) {
            return defaultRes(res, 403, "Acccess denied: Password didn't match")
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d',
            },
        )
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

const changePassword = async (req, res) => {
    try {
        const userId = req.body.userId

        const user = await User.findById(userId)
        const passwordMatches = await bcrypt.compare(
            req.body.oldPassword,
            user.password,
        )
        if (!passwordMatches) {
            return defaultRes(res, 403, "Acccess denied: Password didn't match")
        }

        const password = await bcrypt.hash(req.body.newPassword, 10)

        await User.findByIdAndUpdate(userId, { password })

        return updated(res, 'Your password', req.body.newPassword)
    } catch (error) {
        return errorHandler(res, error)
    }
}

const getVerCode = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return bad(res, 'Email is')
        }

        const existEmail = await User.findOne({ email })

        if (!existEmail) {
            return defaultRes(res, 404, 'Access denied: Email not found')
        }

        const code = sendVerCode(email)

        await cacheVerCode(email, code)

        return defaultRes(res, 200, 'Code send successfully')
    } catch (error) {
        return errorHandler(res, error)
    }
}

const checkVerificationCode = async (req, res) => {
    try {
        const { email, code } = req.body

        if ((!email, !code)) {
            return bad(res, 'email and code are')
        }

        const check = await checkVerCode(email, code)

        if (!check) {
            return res.status(403).json({
                message: 'Access denied: Code incorrect',
                success: false,
            })
        }

        await verUser(email)

        return res.status(200).json({
            message: 'You verifired successfully',
            data: email,
            success: true,
        })
    } catch (error) {
        return errorHandler(res, error)
    }
}

const newPassword = async (req, res) => {
    try {
        let { email, password } = req.body

        const check = await checkUser(email)

        if (!check) {
            return res.status(403).json({
                message: "Access denied: You don't verifired user",
                success: false,
            })
        }

        password = await bcrypt.hash(password, 10)

        let user = await User.findOneAndUpdate({ email }, { password })

        user = {
            id: user.id,
            name: user.name,
            email,
            phone: user.phone,
        }

        return res.status(200).json({
            message: 'Password updated successfully',
            data: user,
            success: true,
        })
    } catch (error) {
        return errorHandler(res, error)
    }
}

const changePhone = async (req, res) => {
    try {
        const { userId, newPhone } = req.body

        // Changed: Use findOne instead of find
        const existPhone = await User.findOne({ phone: newPhone })

        if (existPhone) {
            // Changed: Return an error message with the correct function name
            return defaultRes(res, 403, 'Phone number already exists')
        }

        await User.findByIdAndUpdate(userId, { phone: newPhone }, { new: true })

        // Changed: Correct function name used for response
        return updated(res, 'Your phone number', newPhone)
    } catch (error) {
        // Changed: Use correct error handling function
        return errorHandler(res, error)
    }
}

const changeEmail = async (req, res) => {
    try {
        const { userId, email } = req.body

        // Changed: Use findOne instead of find
        const existEmail = await User.findOne({ email })

        if (existEmail) {
            // Changed: Return an error message with the correct function name
            return defaultRes(res, 403, 'Email already exists')
        }

        await User.findByIdAndUpdate(userId, { email }, { new: true })

        // Changed: Correct function name used for response
        return updated(res, 'Your email', email)
    } catch (error) {
        return errorHandler(res, error)
    }
}

const updateDatas = async (req, res) => {
    try {
        const { userId, name, image, social } = req.body

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                name,
                image,
                social,
            },
            { new: true },
        )

        const userObj = {
            id: userId,
            name: updatedUser.name,
            image: updatedUser.image,
            social: updatedUser.social,
        }

        return updated(res, 'User datas', userObj)
    } catch (error) {
        return errorHandler(res, error)
    }
}

const refreshToken = async (req, res) => {
    try {
        const { userId, role } = req.body
        const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        })

        return res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            token,
        })
    } catch (error) {
        return errorHandler(res, error)
    }
}

const deleteUser = async (req, res) => {
    try {
        const { userId, password } = req.body

        const user = await User.findById(userId)

        if (!user) {
            return notFound(res, 'User')
        }

        const passwordMatches = await bcrypt.compare(password, user.password)

        if (!passwordMatches) {
            return res.status(403).json({
                message: "Password didn't match",
                success: false,
            })
        }

        await User.findByIdAndDelete(userId)

        return deleted(res, 'User')
    } catch (error) {
        return errorHandler(res, error)
    }
}

export {
    login,
    register,
    getVerCode,
    changePhone,
    changeEmail,
    updateDatas,
    refreshToken,
    changePassword,
    checkVerificationCode,
    newPassword,
    deleteUser,
}
