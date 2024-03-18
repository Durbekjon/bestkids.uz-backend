import mongoose from 'mongoose'

const Schema = mongoose.Schema

const teamSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    role: {
        type: String,
        required: true,
    },
})

const Team = mongoose.model('Team', teamSchema)

export default Team
