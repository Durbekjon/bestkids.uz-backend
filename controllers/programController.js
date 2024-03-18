import Program from '../models/Programs.js'
import errorHandler from './errorController.js'
import { created, get, notFound, updated } from './responsController.js'
const create = async (req, res) => {
    try {
        const { image, title, description, age, weakly, time, user } = req.body
        const newProgram = new Program({
            image,
            title,
            description,
            age,
            weakly,
            time,
            user,
        })
        await newProgram.save()

        return created(res, 'Program', newProgram)
    } catch (error) {
        return errorHandler(res, error)
    }
}

const getAll = async (req, res) => {
    try {
        const allPrograms = await Program.find().populate(
            'image user',
            'id name',
        )

        return get(res, 'All Programs', allPrograms)
    } catch (error) {
        return errorHandler(res, error)
    }
}

const getOne = async (req, res) => {
    try {
        const id = req.params.id

        const program = await Program.findById(id).populate(
            'image user',
            'id name',
        )

        if (!program) {
            return notFound(res, 'Program')
        }

        return get(res, 'Program', program)
    } catch (error) {
        return errorHandler(res, error)
    }
}

const update = async (req, res) => {
    try {
        const id = req.params.id

        const prog = await Program.findById(id)

        if (!prog) {
            return notFound(res, 'Program')
        }
        const { image, title, description, age, weakly, time, user } = req.body

        const updatedProg = await Program.findByIdAndUpdate(
            id,
            {
                image,
                user,
                title,
                description,
                age,
                weakly,
                time,
            },
            { new: true },
        )

        return updated(res, 'Program', updatedProg)
    } catch (error) {
        return errorHandler(res, error)
    }
}
const deleteOne = async (req, res) => {
    try {
        const id = req.params.id

        const prog = await Program.findById(id)

        if (!prog) {
            return res.status(404).json({
                message: 'Program not found',
                success: false,
            })
        }

        await Program.findByIdAndDelete(id)

        return res.status(200).json({
            message: 'Program deleted successfully',
            success: true,
        })
    } catch (error) {
        errorHandler(res, error)
    }
}
export { create, getAll, getOne, update, deleteOne }
