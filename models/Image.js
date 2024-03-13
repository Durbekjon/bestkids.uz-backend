import mongoose from 'mongoose'

const Schema = mongoose.Schema

const image = new Schema({
    size: {
        type: Number,
        required: true,
    },
    bucket: {
        type: String,
        required: true,
    },
    key: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    // created_at:{
    //     default: Date.now()
    // }
})

const Image = mongoose.model('Image', image)

export default Image
