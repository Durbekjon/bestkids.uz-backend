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

    // cloudinary

    url: {
        type: String,
    },

    public_id: {
        type: String,
    },

    for: {
        type: String,
        enum: ['course', 'user', 'noactive'],
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
