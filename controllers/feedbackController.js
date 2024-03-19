import Feedback from '../models/Feedback.js'
import express from 'express'
import {
    created,
    errorHandler,
    bad,
    get,
    notFound,
    updated,
    deleted,
} from './responsController.js'
const req = express.request
const res = express.response

const create = async (req, res) => {
    try {
        const { userId, rate, message } = req.body
        console.log(req.body)
        if (!rate || !message) {
            return bad(res, 'Rate and message are')
        }

        const newFeedback = new Feedback({ user: userId, rate, message })
        await newFeedback.save()

        return created(res, 'Feedback', newFeedback)
    } catch (error) {
        return errorHandler(res, error)
    }
}
const getAll = async (req, res) => {
    try {
        const all = await Feedback.find().populate('user', 'image name')

        return get(res, 'Feedbacks', all)
    } catch (error) {
        return errorHandler(res, error)
    }
}
const getOne = async (req, res) => {
    try {
        const id = req.params.id

        if (!id) {
            return bad(res, 'feedback ID')
        }
        const feedback = await Feedback.findById(req.params.id).populate(
            'user',
            'image name',
        )
        if (!feedback) {
            return notFound(res, 'Feedback')
        }

        return get(res, 'Feedback', feedback)
    } catch (error) {
        return errorHandler(res, error)
    }
}

const update = async (req, res) => {
    try {
        const id = req.params.id

        const { userId, rate, message } = req.body

        if (!id || !rate || !message) {
            return bad(res, 'Feedback id, rate, and message are ') // Corrected typo
        }

        let feedback = await Feedback.findById(id)

        if (!feedback) {
            return notFound(res, 'Feedback')
        }

        console.log(feedback.user, userId)

        // Correcting the comparison operator
        if (feedback.user.toString() !== userId.toString()) {
            return res.status(403).json({
                message: 'Access denied: This feedback is not yours',
                success: false,
            })
        }

        feedback = await Feedback.findByIdAndUpdate(
            id,
            { rate, message },
            { new: true },
        )

        return updated(res, 'Feedback', feedback)
    } catch (error) {
        return errorHandler(res, error)
    }
}

const deleteOne = async (req, res) => {
    try {
        const id = req.params.id

        const { userId } = req.body

        if (!id) {
            return bad(res, 'feedback ID')
        }

        const feedback = await Feedback.findById(id)

        if (!feedback) {
            return notFound(res, 'Feedback')
        }

        if (feedback.user.toString() !== userId.toString()) {
            return res.status(403).json({
                message: 'Access denied: This feedback is not yours',
                success: false,
            })
        }

        await Feedback.findByIdAndDelete(id)

        return deleted(res, 'Feedback')
    } catch (error) {
        return errorHandler(res, error)
    }
}

export { create, getAll, getOne, update, deleteOne }
