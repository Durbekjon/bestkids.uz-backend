import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import {
    create,
    getAll,
    getOne,
    update,
    deleteOne,
} from '../controllers/coursesController.js'
const router = express.Router()

router.post('/', authMiddleware, create)

router.get('/', getAll)

router.get('/:id', getOne)

router.put('/:id', authMiddleware, update)

router.delete('/:id', authMiddleware, deleteOne)

export default router
