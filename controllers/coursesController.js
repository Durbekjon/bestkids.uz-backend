import Course from '../models/Course.js'
import Image from '../models/Image.js'
import {
    errorHandler,
    created,
    get,
    bad,
    notFound,
    updated,
    deleted,
} from './responsController.js'

const create = async (req, res) => {
    try {
        const {
            class_img,
            description,
            teacher,
            category,
            price,
            age,
            duration,
            volume,
            grade,
            method,
            method_img,
            about_img,
            about_description,
            advantages,
        } = req.body

        const newCourse = new Course({
            class_img,
            description,
            teacher,
            category,
            price,
            age,
            duration,
            volume,
            grade,
            method,
            method_img,
            about_img,
            about_description,
            advantages,
        })
        const images = [...class_img, ...method_img, ...about_img]

        images.map((id) => {
            Image.findByIdAndUpdate(id, { for: 'course' })
        })

        await newCourse.save()

        return created(res, 'Course', newCourse)
    } catch (error) {
        return errorHandler(res, error)
    }
}

const getAll = async (req, res) => {
    try {
        const courses = await Course.find().populate(
            'class_img method_img about_img category teacher',
            'name',
        )

        return get(res, 'Courses', courses)
    } catch (error) {
        return errorHandler(res, error)
    }
}

const getOne = async (req, res) => {
    try {
        const id = req.params.id

        if (!id) {
            return bad(res, 'id is')
        }

        const course = await Course.findById(id).populate(
            'class_img method_img about_img category teacher',
            'name',
        )

        if (!course) {
            return notFound(res, 'Course')
        }

        return get(res, 'Course', course)
    } catch (error) {
        return errorHandler(res, error)
    }
}

const update = async (req, res) => {
    try {
        const id = req.params.id

        const {
            class_img,
            description,
            teacher,
            category,
            price,
            age,
            duration,
            volume,
            grade,
            method,
            method_img,
            about_img,
            about_description,
            advantages,
        } = req.body

        if (!id) {
            return bad(res, 'id is')
        }

        let course = await Course.findById(id)

        if (!course) {
            return notFound(res, 'Course')
        }

        course = await Course.findByIdAndUpdate(
            id,
            {
                class_img,
                description,
                teacher,
                category,
                price,
                age,
                duration,
                volume,
                grade,
                method,
                method_img,
                about_img,
                about_description,
                advantages,
            },
            { new: true },
        )
        return updated(res, 'Course', course)
    } catch (error) {
        return errorHandler(res, error)
    }
}

const deleteOne = async (req, res) => {
    try {
        const id = req.params.id

        if (!id) {
            return bad(res, 'id is')
        }

        let course = await Course.findById(id)

        if (!course) {
            return notFound(res, 'Course')
        }

        await Course.findByIdAndDelete(id)

        return deleted(res, 'Course')
    } catch (error) {}
}

export { create, getAll, getOne, update, deleteOne }
