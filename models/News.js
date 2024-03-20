import mongoose from 'mongoose'

const Schema = mongoose.Schema

const news = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        image: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Image',
        },
        date: {
            type: Date,
        },
    },
    { timestamps: true },
)
const News = mongoose.model('News', news)
export default News
