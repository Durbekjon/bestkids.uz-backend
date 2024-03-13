import mongoose from 'mongoose'

const Schema = mongoose.Schema

const image = new Schema({
    size: {
        type: Number,
        required: true,
    },
    public_id: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
})

const Image = mongoose.model('Image', image)

export default Image
