import {
    register,
    login,
    changePhone,
    changeEmail,
    refreshToken,
    updateDatas,
    changePassword,
    getVerCode,
    checkVerificationCode,
    newPassword,
    deleteUser,
} from '../controllers/authController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import express from 'express'

const router = express.Router()

router.post('/get-verification-code', getVerCode)

router.post('/check-verification-code', checkVerificationCode)

router.post('/new-password', newPassword)

router.post('/change-password', authMiddleware, changePassword)

router.post('/change-phone', authMiddleware, changePhone)

router.post('/change-email', authMiddleware, changeEmail)

router.post('/refresh', authMiddleware, refreshToken)

router.put('/update', authMiddleware, updateDatas)

router.delete('/delete-profile', authMiddleware, deleteUser)

router.post('/register', register)

router.post('/login', login)

export default router
