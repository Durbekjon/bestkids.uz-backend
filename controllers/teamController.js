import Team from '../models/Team.js'

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

        return res.status(201).json({
            message: 'New team member created successfully',
            data: savedTeamMember,
            success: true,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false,
        })
    }
}

const getAll = async (req, res) => {
    try {
        const team = await Team.find()
            .populate('user', 'name social image')
            .exec()

        return res.status(200).json({
            message: 'Team members retrieved successfully',
            data: team,
            success: true,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false,
        })
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
            return res.status(404).json({
                message: 'Member not found',
                success: false,
            })
        }

        return res.status(200).json({
            message: 'Member retrieved successfully',
            data: member,
            success: true,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false,
        })
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
            return res.status(404).json({
                message: 'Member not found',
                success: false,
            })
        }

        return res.status(200).json({
            message: 'Member updated successfully',
            data: updatedMember,
            success: true,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false,
        })
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
            return res.status(404).json({
                message: 'Member not found',
                success: false,
            })
        }

        return res.status(200).json({
            message: 'Member deleted successfully',
            success: true,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false,
        })
    }
}

export { create, getAll, getOne, update, deleteMember }
