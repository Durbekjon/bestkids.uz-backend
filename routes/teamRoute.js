import express from 'express'
import {
    create,
    getAll,
    getOne,
    update,
    deleteMember,
} from '../controllers/teamController.js'

import adminMiddleware from '../middleware/adminMiddleware.js' // Importing adminMiddleware

const router = express.Router()

router.post('/', adminMiddleware, create) // Applying adminMiddleware to the create route

router.get('/', getAll)

router.get('/:id', getOne)
router.put('/:id', adminMiddleware, update) // Applying adminMiddleware to the update route

router.delete('/:id', adminMiddleware, deleteMember) // Applying adminMiddleware to the delete route

export default router
