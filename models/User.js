import mongoose, { Types } from 'mongoose'

const Schema = mongoose.Schema

const user = new Schema({
    name:{
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    social: {
        telegram: {
            type: String,
        },
        instagram: {
            type: String,
        },
        facebook: {
            type: String,
        },
    },
    role: {
        type: String,
        enum: ['user', 'teacher', 'admin'],
        default: 'user',
    },
    image: {
        type: mongoose.Types.ObjectId,
        ref: 'Image',
    },
})
const User = mongoose.model('User', user)

export default User
