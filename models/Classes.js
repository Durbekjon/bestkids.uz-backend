import mongoose from 'mongoose'

const Schema = mongoose.Schema

const classes = new Schema({
    icon: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
})
const Classes = mongoose.model('Classes', classes)

export default Classes
