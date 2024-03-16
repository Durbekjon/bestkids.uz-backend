import mongoose from 'mongoose'

const Schema = mongoose.Schema

const teamSchema = new Schema({
    img: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    role: {
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
})

const Team = mongoose.model('Team', teamSchema)

export default Team
