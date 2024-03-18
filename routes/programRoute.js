import express from 'express'
import adminMiddleware from '../middleware/adminMiddleware.js'
import {
    create,
    deleteOne,
    getAll,
    getOne,
    update,
} from '../controllers/programController.js'

const router = express.Router()

router.post('/', adminMiddleware, create)

router.get('/', getAll)

router.get('/:id', getOne)

router.put('/:id', adminMiddleware, update)

router.delete('/:id', adminMiddleware, deleteOne)

export default router
