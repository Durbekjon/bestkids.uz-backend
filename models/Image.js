import mongoose from 'mongoose'

const Schema = mongoose.Schema

const image = new Schema({
    // upload server
    name: {
        type: String,
        required: true,
    },

    // aws
    bucket: {
        type: String,
    },
    key: {
        type: String,
    },
    location: {
        type: String,
    },

    for: {
        type: String,
        enum: ['phone', 'category', 'user', 'noactive'],
        default: 'noactive',
    },
    size: {
        type: Number,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
})

const Image = mongoose.model('Image', image)

export default Image
