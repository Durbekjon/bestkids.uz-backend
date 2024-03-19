import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import {
    create,
    deleteOne,
    getAll,
    getOne,
    update,
} from '../controllers/categoryController.js'
const router = express.Router()

router.post('/', authMiddleware, create)

router.get('/', getAll)

router.get('/:id', getOne)

router.put('/:id', authMiddleware, update)

router.delete('/:id', authMiddleware, deleteOne)

export default router
