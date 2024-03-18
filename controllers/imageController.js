import { incMemory, decMemory } from './memoryController.js'
import Memory from '../models/Memory.js'
import Image from '../models/Image.js'
import fs from 'fs'
import {
    created,
    deleted,
    errorHandler,
    notFound,
} from './responsController.js'
const upload = async (req, res) => {
    try {
        const files = req.files
        if (!files || files.length === 0) {
            return res.status(400).json({
                message: 'No files uploaded',
                success: false,
            })
        }
        const uploadedImages = []

        for (const file of files) {
            const { filename, size } = file

            const newImg = new Image({ name: filename, size })
            await incMemory(newImg.size)
            await newImg.save()

            uploadedImages.push(newImg)
        }

        return created(res, 'Image', uploadedImages)
    } catch (error) {
        return errorHandler(res, error)
    }
}
const noActiveImages = async (req, res) => {
    try {
        const images = await Image.find({ for: 'noactive' })

        return res.status(200).json({
            message: 'No active images',
            data: images,
            success: true,
        })
    } catch (error) {
        return errorHandler(res, error)
    }
}
const deleteMany = async (req, res) => {
    try {
        const imagesId = req.body.images

        if (!imagesId || imagesId.length === 0) {
            return res.status(400).json({
                message: 'Images must be included in the request',
                success: false,
            })
        }

        const notFoundImages = []
        const deletedImages = []

        for (const id of imagesId) {
            const image = await Image.findById(id)

            if (!image) {
                notFoundImages.push(id)
                continue
            }

            incMemory(image.size)
            fs.unlinkSync(`./uploads/${image.name}`)
            await Image.findOneAndDelete(id)

            deletedImages.push(id)
        }

        if (deletedImages.length === 0) {
            return res.status(404).json({
                message: 'Images not found',
                images_id: notFoundImages,
                success: false,
            })
        }
        return res.status(200).json({
            message: 'Images deleted successfully',
            deleted_images: deletedImages,
            not_found_images: notFoundImages,
            success: true,
        })
    } catch (error) {
        return errorHandler(res, error)
    }
}
const deleteOne = async (req, res) => {
    try {
        const img = await Image.findById(req.params.id)

        if (!img) {
            return notFound(res, 'Image')
        }

        fs.unlinkSync(`./uploads/${img.name}`)

        await decMemory(img.size)

        await Image.findByIdAndDelete(img.id)

        deleted(res, 'Image')
    } catch (error) {
        return errorHandler(res, error)
    }
}

const totalMemorySize = async (req, res) => {
    try {
        const memory = await Memory.findOne()
        const total_mem = memory ? memory.total_size : 0

        let total_mem_mb = total_mem / (1024 * 1024)
        let total_mem_gb = total_mem_mb / 1024

        total_mem_mb = parseFloat(total_mem_mb.toFixed(2))
        total_mem_gb = parseFloat(total_mem_gb.toFixed(2))

        let result =
            total_mem >= 1024 * 1024 * 1024
                ? `${total_mem_gb} GB`
                : `${total_mem_mb} MB`

        const imagesCount = await Image.countDocuments()

        return res.status(200).json({
            totalMemory: result,
            total_images: imagesCount,
        })
    } catch (error) {
        return errorHandler(res, error)
    }
}

export { upload, noActiveImages, deleteMany, deleteOne, totalMemorySize }
