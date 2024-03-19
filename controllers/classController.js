import Class from '../models/Classes.js'
import {
    errorHandler,
    created,
    bad,
    defaultRes,
    get,
    notFound,
    updated,
    deleted,
} from './responsController.js'

const create = async (req, res) => {
    try {
        const { icon, title, description, course } = req.body

        if (!icon || !title || !description) {
            return bad(res, 'icon title description')
        }

        const classWithCourse = await Class.findOne({ course })

        if (classWithCourse) {
            return defaultRes(res, 403, 'Course allready exist')
        }

        const newClass = new Class({ icon, title, description, course })
        await newClass.save()

        return created(res, 'Class', newClass)
    } catch (error) {
        return errorHandler(res, error)
    }
}

const getAll = async (req, res) => {
    try {
        const classes = await Class.find().populate('course')

        return get(res, 'Classes', classes)
    } catch (error) {
        return errorHandler(res, error)
    }
}

const getOne = async (req, res) => {
    try {
        const id = req.params.id

        if (!id) {
            return bad(res, 'Class ID')
        }

        const class1 = await Class.findById(id).populate('course')

        if (!class1) {
            return notFound(res, 'Class')
        }

        return get(res, 'Class', class1)
    } catch (error) {
        return errorHandler(res, error)
    }
}

const update = async (req, res) => {
    try {
        const id = req.params.id

        if (!id) {
            return bad(res, 'Class ID')
        }

        let class1 = await Class.findById(id)

        if (!class1) {
            return notFound(res, 'Class')
        }
        const { icon, title, description, course } = req.body

        class1 = await Class.findByIdAndUpdate(
            id,
            {
                icon,
                title,
                description,
                course,
            },
            { new: true },
        )

        return updated(res, 'Class', class1)
    } catch (error) {
        return errorHandler(res, error)
    }
}

const deleteOne = async (req, res) => {
    try {
        const id = req.params.id

        if (!id) {
            return bad(res, 'Class ID')
        }

        let class1 = await Class.findById(id)

        if (!class1) {
            return notFound(res, 'Class')
        }

        await Class.findByIdAndDelete(id)

        return deleted(res, 'Class')
    } catch (error) {
        return errorHandler(res, error)
    }
}

export { create, getAll, getOne, update, deleteOne }
