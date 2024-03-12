import mongoose from 'mongoose'

const Schema = mongoose.Schema

const category = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
})
const Category = mongoose.model('Category', category)

export default Category
