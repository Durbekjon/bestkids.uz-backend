import mongoose from 'mongoose'

const Schema = mongoose.Schema

const classes = new Schema({
    icon: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    course: {
        type: mongoose.Types.ObjectId,
        ref: 'Course',
        unique: true,
    },
})

const Class = mongoose.model('Class', classes)
export default Class
