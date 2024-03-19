import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decodedToken.userId

        req.body.userId = userId
        req.body.role = decodedToken.role
        next()
    } catch (error) {
        res.status(401).send({
            message: 'Siz tasdiqlanmagansiz',
            data: error,
            success: false,
        })
    }
}

export default authMiddleware
