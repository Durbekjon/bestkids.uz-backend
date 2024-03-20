import mongoose from 'mongoose'

const Schema = mongoose.Schema

const comment = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    news: {
        type: mongoose.Types.ObjectId,
        ref: 'News',
    },
    comment: {
        type: String,
        required: true,
    },
})
const Comment = mongoose.model('Comment', comment)

export default Comment
