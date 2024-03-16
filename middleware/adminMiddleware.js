import jwt from 'jsonwebtoken'

const adminMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const role = decodedToken.role

        if (role !== 'admin') {
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
