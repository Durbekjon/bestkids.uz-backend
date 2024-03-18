import mongoose from 'mongoose'

const Schema = mongoose.Schema

const program = new Schema({
    image: { type: mongoose.Types.ObjectId, ref: 'Image' },
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String },
    age: { type: String, required: true },
    weakly: { type: String, required: true },
    time: { type: String, required: true },
})

const Program = mongoose.model('Program', program)

export default Program
