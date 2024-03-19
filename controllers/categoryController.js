import Category from '../models/category.js'
import {
    bad,
    created,
    defaultRes,
    deleted,
    errorHandler,
    get,
    notFound,
    updated,
} from './responsController.js'
const create = async (req, res) => {
    try {
        const { name, description } = req.body

        if (!name || !description) {
            return bad(res, 'name and description are')
        }

        const categoryExists = await Category.findOne({ name })

        if (categoryExists) {
            return defaultRes(res, 403, 'Category allready exist')
        }

        const newCategory = new Category({ name, description })
        await newCategory.save()
        return created(res, 'Category', newCategory)
    } catch (error) {
        return errorHandler(res, error)
    }
}

const getAll = async (req, res) => {
    try {
        const categories = await Category.find()
        return get(res, 'Categories', categories)
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false,
        })
    }
}

const getOne = async (req, res) => {
    try {
        const id = req.params.id
        const category = await Category.findById(id)

        if (!category) {
            return notFound(res, 'Category')
        }

        return get(res, 'Category', category)
    } catch (error) {
        return errorHandler(res, error)
    }
}

const update = async (req, res) => {
    try {
        const id = req.params.id
        const { name, description } = req.body

        if (!id || !name || !description) {
            return bad(res, 'id , name and description are')
        }

        let category = await Category.findById(id)

        if (!category) {
            return notFound(res, 'Category')
        }

        category = await Category.findByIdAndUpdate(
            id,
            { name, description },
            {
                new: true,
            },
        )
        return updated(res, 'Category', category)
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

        let category = await Category.findById(id)

        if (!category) {
            return notFound(res, 'Category')
        }

        await Category.findByIdAndDelete(id)

        return deleted(res, 'Category')
    } catch (error) {
        return errorHandler(res, error)
    }
}

export { create, getAll, getOne, update, deleteOne }
