import mongoose from 'mongoose'

const { Schema } = mongoose

const accessSchema = new Schema({
    models: [
        {
            model: {
                type: String,
                required: true,
            },
        },
    ],
    permissions: {
        read: {
            type: Boolean,
            default: false,
        },
        create: {
            type: Boolean,
            default: false,
        },
        update: {
            type: Boolean,
            default: false,
        },
        delete: {
            type: Boolean,
            default: false,
        },
    },
})

const roleSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    access: [accessSchema],
})

const Role = mongoose.model('Role', roleSchema)

export default Role
