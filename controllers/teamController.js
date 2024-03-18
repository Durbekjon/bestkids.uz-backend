import Team from '../models/Team.js'
import errorHandler from './errorController.js'
import {
    created,
    deleted,
    get,
    notFound,
    updated,
} from './responsController.js'
const create = async (req, res) => {
    try {
        const { user, role } = req.body

        if (!user || !role) {
            return res.status(400).json({
                message: 'User and role are required fields',
                success: false,
            })
        }

        const newTeamMember = new Team({ user, role })
        const savedTeamMember = await newTeamMember.save()

        return created(res, 'New team member', savedTeamMember)
    } catch (error) {
        return errorHandler(res, error)
    }
}

const getAll = async (req, res) => {
    try {
        const team = await Team.find()
            .populate('user', 'name social image')
            .exec()

        return get(res, 'Team members', team)
    } catch (error) {
        return errorHandler(res, error)
    }
}

const getOne = async (req, res) => {
    try {
        const memberId = req.params.id

        if (!memberId) {
            return res.status(400).json({
                message: 'Member ID is required',
                success: false,
            })
        }

        const member = await Team.findById(memberId).populate('user').exec()

        if (!member) {
            return notFound(res, 'Member')
        }

        return get(res, 'Member', member)
    } catch (error) {
        return errorHandler(res, error)
    }
}

const update = async (req, res) => {
    try {
        const memberId = req.params.id
        const { user, role } = req.body

        if (!memberId || !user || !role) {
            return res.status(400).json({
                message: 'Member ID, user, and role are required fields',
                success: false,
            })
        }

        const updatedMember = await Team.findByIdAndUpdate(
            memberId,
            { user, role },
            { new: true },
        )

        if (!updatedMember) {
            return notFound(res, 'Member')
        }

        return updated(res, 'Member', updatedMember)
    } catch (error) {
        return errorHandler(res, error)
    }
}

const deleteMember = async (req, res) => {
    try {
        const memberId = req.params.id

        if (!memberId) {
            return res.status(400).json({
                message: 'Member ID is required',
                success: false,
            })
        }

        const deletedMember = await Team.findByIdAndDelete(memberId)

        if (!deletedMember) {
            return notFound(res, 'Member')
        }

        return deleted(res, 'Member')
    } catch (error) {
        return errorHandler(res, error)
    }
}

export { create, getAll, getOne, update, deleteMember }
