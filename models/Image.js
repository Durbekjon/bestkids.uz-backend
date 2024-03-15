import mongoose from 'mongoose'

const Schema = mongoose.Schema

const image = new Schema({
    size: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        unique: true,
    },
    for: {
        type: String,
        enum: ['phone', 'category', 'user', 'noactive'],
        default: 'noactive',
    },

    created_at: {
        type: Date,
        default: Date.now(),
    },
})

const Image = mongoose.model('Image', image)

export default Image
