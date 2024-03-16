import adminMiddleware from '../middleware/adminMiddleware.js'
import authMiddleware from '../middleware/authMiddleware.js'
import uploadFolder from '../middleware/upload.js'
import {
    upload,
    noActiveImages,
    deleteMany,
    deleteOne,
    totalMemorySize,
} from '../controllers/imageController.js'
import express from 'express'
const router = express.Router()
router.post('/upload/:folder', authMiddleware, uploadFolder, upload)

router.get('/no-active-images', adminMiddleware, noActiveImages)

router.delete('/delete-many', authMiddleware, deleteMany)

router.delete('/delete/:id', authMiddleware, deleteOne)

router.get('/total-memory-size', totalMemorySize)

export default router
