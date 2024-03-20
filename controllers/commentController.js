import Comment from '../models/Comment.js'
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
        const { userId, comment, news } = req.body

        if (!comment || !news) {
            return bad(res, 'News id and comment are')
        }

        const newComment = new Comment({ user: userId, news, comment })

        await newComment.save()

        return created(res, 'Comment', newComment)
    } catch (error) {
        return errorHandler(res, error)
    }
}

const getAll = async (req, res) => {
    try {
        const comments = await Comment.find().populate('news')

        return get(res, 'Comments', comments)
    } catch (error) {
        return errorHandler(res, error)
    }
}

const getOne = async (req, res) => {
    try {
        const id = req.params.id

        if (!id) {
            return bad(res, 'Id')
        }

        const comment = await Comment.findById(id).populate('news')

        if (!comment) {
            return notFound(res, 'Comment')
        }

        return get(res, 'Comment', comment)
    } catch (error) {
        return errorHandler(res, error)
    }
}
const update = async (req, res) => {
    try {
        const id = req.params.id
        const { userId, comment } = req.body
        if (!id || !comment) {
            return bad(res, 'Id and comment are')
        }

        let comments = await Comment.findById(id)

        if (!comments) {
            return notFound(res, 'Comment')
        }

        if (userId.toString() !== comments.user.toString()) {
            return res.status(403).json({
                message: 'Access denied: this comment not yours',
                success: false,
            })
        }
        comments = await Comment.findByIdAndUpdate(
            id,
            { comment },
            { new: true },
        )

        return updated(res, 'Comment', comments)
    } catch (error) {
        return errorHandler(res, error)
    }
}
const deleteOne = async (req, res) => {
    try {
        const id = req.params.id

        if (!id) {
            return bad(res, 'Id')
        }

        const comment = await Comment.findById(id)

        if (!comment) {
            return notFound(res, 'Comment')
        }

        if (req.body.userId.toString() !== comment.user.toString()) {
            return res.status(403).json({
                message: 'Access denied: this comment not yours',
                success: false,
            })
        }

        await Comment.findByIdAndDelete(id)

        return deleted(res, 'Comment')
    } catch (error) {
        return errorHandler(res, error)
    }
}
const deleteMany = async (req, res) => {
    try {
        const { id } = req.body

        const deleted_comments = []
        const not_found = []

        // Use for...of loop to await the resolution of each deletion operation
        for (const commentId of id) {
            const delCom = await Comment.findByIdAndDelete(commentId)
            if (!delCom) {
                not_found.push(commentId)
            } else {
                deleted_comments.push(commentId)
            }
        }

        if (deleted_comments.length === 0) {
            return res.status(404).json({
                message: 'Comments not found',
                not_found,
                success: false,
            })
        }

        return res.status(200).json({
            message: 'Comments deleted successfully',
            deleted_comments,
            not_found,
            success: true,
        })
    } catch (error) {
        return errorHandler(res, error)
    }
}

export { create, getAll, getOne, update, deleteOne, deleteMany }
