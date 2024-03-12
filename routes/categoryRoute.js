import express from 'express'
import adminMiddleware from '../middleware/adminMiddleware.js'
import Category from '../models/Category.js'

const router = express.Router()

router.post('/', adminMiddleware, async (req, res) => {
    try {
        const { name, description } = req.body
        const newCategory = await new Category({ name, description }).save()

        return res.status(201).json({
            message: 'Category created Successfully',
            data: newCategory,
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
        const categories = await Category.find()

        return res.status(200).json({
            message: 'All Categoryies get',
            data: categories,
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
        const category = await Category.findById(req.params.id)

        if (!category) {
            return res.status(404).json({
                message: 'Category not found',
            })
        }

        return res.status(200).json({
            message: 'Category get',
            data: category,
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
        let category = await Category.findById(req.params.id)

        if (!category) {
            return res.status(404).json({
                message: 'Category not found',
            })
        }

        const { name, description } = req.body

        category.name = name
        category.description = description

        await category.save()

        return res.status(200).json({
            message: 'Category updated successfully',
            data: category,
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
        const category = await Category.findById(req.params.id)

        if (!category) {
            return res.status(404).json({
                message: 'Category not found',
            })
        }

        await Category.findByIdAndDelete(category.id)

        return res.status(200).json({
            message: 'Category deleted successfully',
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
