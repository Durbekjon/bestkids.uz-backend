import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const adminMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decodedToken.userId
        req.body.userId = userId

        const user = await User.findById(userId)
        if (!user || user.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied: You are not an admin',
                success: false,
            })
        }
        next()
    } catch (error) {
        res.status(401).send({
            message: 'Authentication failed',
            data: error,
            success: false,
        })
    }
}

export default adminMiddleware
