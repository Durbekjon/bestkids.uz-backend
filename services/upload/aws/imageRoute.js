import express from 'express'
import s3 from './aws-s3.js'
import Image from '../../../models/Image.js'
import Memory from '../../../models/Memory.js'
import upload from './multer.js'
import authMiddleware from '../../../middleware/authMiddleware.js'
import adminMiddleware from '../../../middleware/adminMiddleware.js'
// import adminMiddleware from '../../../middleware/adminMiddleware.js'
const router = express.Router()

router.post(
    '/upload/:folder',
    authMiddleware,
    (req, res, next) => {
        const folder = req.params.folder
        if (req.files && req.files.length === 1) {
            upload(folder).single('image')(req, res, next)
        } else {
            upload(folder).array('image', 10)(req, res, next)
        }
    },
    async (req, res) => {
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
                console.log(file)
                const { size, bucket, key, location } = file

                const uniqueSuffix = Math.round(Math.random() * 1e9)

                const name = uniqueSuffix + '.' + file.mimetype.split('/')[1]

                const newImg = await new Image({
                    name,
                    size,
                    bucket,
                    key,
                    location,
                }).save()
                uploadedImages.push(newImg)
                await incMemory(size)
            }

            res.status(201).json({
                message: 'Images uploaded Successfully',
                data: uploadedImages,
                success: true,
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error.message,
                success: false,
            })
        }
    },
)

router.delete('/delete-many', adminMiddleware, async (req, res) => {
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

            const params = {
                Bucket: image.bucket,
                Key: image.key,
            }

            s3.deleteObject(params, (err) => {
                if (err) {
                    return res
                        .status(500)
                        .json({ message: err.message, success: false })
                }

                Image.findByIdAndDelete(id)
                deletedImages.push(id)
            })
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
        return res.status(500).json({
            message: error.message,
            success: false,
        })
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id
        const image = await Image.findById(id)

        if (!image) {
            return res.status(404).json({
                message: 'Image not found',
                success: false,
            })
        }

        const params = {
            Bucket: image.bucket,
            Key: image.key,
        }
        await decMemory(image.size)
        await Image.findByIdAndDelete(req.params.id)
        await s3.deleteObject(params, (err, data) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: err.message, success: false })
            }

            res.status(200).json({
                message: 'Image deleted successfully',
                success: true,
            })
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false,
        })
    }
})

router.get('/total-memory-size', async (req, res) => {
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

        const imagesCount = await Image.countDocuments() // Await countDocuments()

        return res.status(200).json({
            totalMemory: result,
            total_images: imagesCount,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server error',
        })
    }
})

async function incMemory(size) {
    try {
        const existingMemory = await Memory.findOne()
        if (!existingMemory || existingMemory.length === 0) {
            const newMem = new Memory({ total_size: size })
            await newMem.save()
        } else {
            existingMemory.total_size += size
            await existingMemory.save()
        }
    } catch (error) {
        console.log(error)
    }
}
async function decMemory(size) {
    try {
        const existingMemory = await Memory.findOne()
        existingMemory.total_size -= size
        await existingMemory.save()
    } catch (error) {
        console.log(error)
    }
}

export default router
