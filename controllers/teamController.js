import Image from '../models/Image.js'
import Team from '../models/Team.js'

const create = async (req, res) => {
    try {
        const { img, name, role, social } = req.body
        const newTeamMember = new Team({ img, name, role, social })
        const savedTeamMember = await newTeamMember.save()

        await Image.findByIdAndUpdate(img, { for: 'team' })

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
        const team = await Team.find().populate('img')
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
        const member = await Team.findById(req.params.id)

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
        const id = req.params.id
        const { img, name, role, social } = req.body
        let member = await Team.findById(id)

        if (!member) {
            return res.status(404).json({
                message: 'Member not found',
                success: false,
            })
        }

        if (img !== member.img) {
            await Image.findByIdAndUpdate(member.img, { for: 'noactive' })
            await Image.findByIdAndUpdate(img, { for: 'team' })
        }

        member = await Team.findByIdAndUpdate(
            id,
            { img, name, role, social },
            { new: true },
        )

        return res.status(200).json({
            message: 'Member updated successfully',
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

const deleteMember = async (req, res) => {
    try {
        const id = req.params.id
        const member = await Team.findById(id)

        if (!member) {
            return res.status(404).json({
                message: 'Member not found',
                success: false,
            })
        }

        await Image.findByIdAndUpdate(member.img, { for: 'noactive' })
        await Team.findByIdAndDelete(id)

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
