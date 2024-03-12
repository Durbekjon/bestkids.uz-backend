import express from 'express'
import adminMiddleware from '../middleware/adminMiddleware.js'
import Classes from '../models/Classes.js'

const router = express.Router()

router.post('/', adminMiddleware, async (req, res) => {
    try {
        const { icon, name, description } = req.body
        const newClasses = await new Classes({ icon, name, description }).save()

        return res.status(201).json({
            message: 'Class created Successfully',
            data: newClasses,
            success: true,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: `Internal server error:${error}`,
        })
    }
})

router.get('/', async (req, res) => {
    try {
        const classes = await Classes.find()

        return res.status(200).json({
            message: 'All classes get',
            data: classes,
            success: true,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: `Internal server error:${error}`,
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const classes = await Classes.findById(req.params.id)

        if (!classes) {
            return res.status(404).json({
                message: 'Class not found',
            })
        }

        return res.status(200).json({
            message: 'Class get',
            data: classes,
            success: true,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: `Internal server error:${error}`,
        })
    }
})

router.put('/:id', adminMiddleware, async (req, res) => {
    try {
        let classes = await Classes.findById(req.params.id)

        if (!classes) {
            return res.status(404).json({
                message: 'Class not found',
            })
        }

        const { icon, name, description } = req.body

        classes.icon = icon
        classes.name = name
        classes.description = description

        await classes.save()

        return res.status(200).json({
            message: 'Class updated successfully',
            data: classes,
            success: true,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: `Internal server error:${error}`,
        })
    }
})

router.delete('/:id', adminMiddleware, async (req, res) => {
    try {
        const classes = await Classes.findById(req.params.id)

        if (!classes) {
            return res.status(404).json({
                message: 'Class not found',
            })
        }

        await Classes.findByIdAndDelete(classes.id)

        return res.status(200).json({
            message: 'Class deleted successfully',
            success: true,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: `Internal server error:${error}`,
        })
    }
})

export default router
