import express from 'express'
import {
    create,
    getAll,
    getOne,
    update,
    deleteOne,
    deleteMany,
} from '../controllers/commentController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
const router = express.Router()

router.post('/', authMiddleware, create)

router.get('/', getAll)

router.get('/:id', getOne)

router.put('/:id', authMiddleware, update)

router.delete('/:id', authMiddleware, deleteOne)

router.delete('/', adminMiddleware, deleteMany)

export default router
