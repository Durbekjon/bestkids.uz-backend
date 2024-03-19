import mongoose from 'mongoose'

const Schema = mongoose.Schema

const feedback = new Schema({
    rate: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    message: {
        type: String,
        required: true,
    },
})
const Feedback = mongoose.model('Feedback', feedback)
export default Feedback
