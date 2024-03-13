import express from 'express'
import Course from '../models/Courses.js'
import adminMiddleware from '../middleware/adminMiddleware.js'

const router = express.Router()

router.post('/', adminMiddleware, async (req, res) => {
    try {
        req.body.teacher_id = req.body.userId

        const newCourse = await new Course(req.body).save()

        return res.status(201).json({
            message: 'Course created successfully',
            data: newCourse,
            success: true,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server error: ' + error,
            success: false,
        })
    }
})

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().populate([
            { path: 'class_img' },
            { path: 'teacher_id' },
            { path: 'category_id' },
            { path: 'method_img' },
            { path: 'about_img' },
        ])

        return res.status(200).json({
            message: 'Courses fetched successfully',
            data: courses,
            success: true,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server error: ' + error.message,
            success: false,
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate([
            { path: 'class_img' },
            { path: 'teacher_id' },
            { path: 'category_id' },
            { path: 'method_img' },
            { path: 'about_img' },
        ])

        if (!course) {
            return res.status(404).json({
                message: 'Course not found',
            })
        }

        return res.status(200).json({
            message: 'Course get successfully',
            data: course,
            success: true,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server error: ' + error,
            success: false,
        })
    }
})

// PUT route for updating a course
router.put('/:id', adminMiddleware, async (req, res) => {
    try {
        const courseId = req.params.id
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            req.body,
            { new: true },
        )

        if (!updatedCourse) {
            return res.status(404).json({
                message: 'Course not found',
            })
        }

        return res.status(200).json({
            message: 'Course updated',
            data: updatedCourse,
            success: true,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server error: ' + error,
            success: false,
        })
    }
})

// DELETE route for deleting a course
router.delete('/:id', adminMiddleware, async (req, res) => {
    try {
        const courseId = req.params.id
        const course = await Course.findByIdAndDelete(courseId)

        if (!course) {
            return res.status(404).json({
                message: 'Course not found',
            })
        }

        return res.status(200).json({
            message: 'Course deleted',
            success: true,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server error: ' + error,
            success: false,
        })
    }
})

export default router
