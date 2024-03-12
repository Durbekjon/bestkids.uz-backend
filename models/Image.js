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
        required: true,
    },
    // created_at:{
    //     default: Date.now()
    // }
})

const Image = mongoose.model('Image', image)

export default Image
