import mongoose from 'mongoose'

const Schema = mongoose.Schema

const user = new Schema({
    phone_number: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    img: {
        type: mongoose.Types.ObjectId,
        ref: 'Image',
        default: '',
    },
    role: {
        type: String,
        enum: ['user', 'teacher', 'admin'],
        default: 'user',
    },
})
const User = mongoose.model('User', user)

export default User
