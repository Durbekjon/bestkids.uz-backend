import Role from '../models/Role.js'
import {
    bad,
    created,
    deleted,
    errorHandler,
    get,
    notFound,
    updated,
} from './responsController.js'

const create = async (req, res) => {
    try {
        const { title, description, access } = req.body

        if (!title || !description || !access) {
            return bad(res, 'title, description,  and access are')
        }

        const newRole = new Role({ title, description, access })

        await newRole.save()

        return created(res, 'Role', newRole)
    } catch (error) {
        return errorHandler(res, error)
    }
}
const getAll = async (req, res) => {
    try {
        const roles = await Role.find()

        return get(res, 'Roles', roles)
    } catch (error) {
        return errorHandler(res, error)
    }
}
const getOne = async (req, res) => {
    try {
        const id = req.params.id

        if (!id) {
            return bad(res, 'ID')
        }

        const role = await Role.findById(id)

        if (!role) {
            return notFound(res, 'Role')
        }

        return get(res, 'Role', role)
    } catch (error) {
        return errorHandler(res, error)
    }
}
const update = async (req, res) => {
    try {
        const id = req.params.id

        if (!id) {
            return bad(res, 'ID')
        }

        let role = await Role.findById(id)

        if (!role) {
            return notFound(res, 'Role')
        }

        const { title, description, access } = req.body

        if (!title || !description || !access) {
            return bad(res, 'title, description, permissions and access are')
        }

        role = await Role.findByIdAndUpdate(
            id,
            {
                title,
                description,
                access,
            },
            { new: true },
        )

        return updated(res, 'Role', role)
    } catch (error) {
        return errorHandler(res, error)
    }
}
const deleteOne = async (req, res) => {
    try {
        const id = req.params.id

        if (!id) {
            return bad(res, 'ID')
        }

        const role = await Role.findById(id)

        if (!role) {
            return notFound(res, 'Role')
        }

        await Role.findByIdAndDelete(id)

        return deleted(res, 'Role')
    } catch (error) {
        return errorHandler(res, error)
    }
}

export { create, getAll, getOne, update, deleteOne }
