import mongoose from 'mongoose'

const Schema = mongoose.Schema

const course = new Schema({
    class_img: {
        type: mongoose.Types.ObjectId,
        ref: 'Image',
    },
    description: {
        type: String,
        required: true,
    },
    teacher: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
    },
    price: {
        type: String,
        required: true,
    },

    age: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    volume: {
        type: String,
        required: true,
    },
    grade: {
        type: String,
        required: true,
    },

    method: {
        type: String,
        required: true,
    },
    method_img: {
        type: mongoose.Types.ObjectId,
        ref: 'Image',
    },

    about_img: {
        type: mongoose.Types.ObjectId,
        ref: 'Image',
    },

    about_description: {
        type: String,
        required: true,
    },
    advantages: [
        {
            advantage: {
                type: String,
                required: true,
            },
        },
    ],
})

const Course = mongoose.model('Course', course)
export default Course
