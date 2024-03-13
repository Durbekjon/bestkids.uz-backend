import express from 'express'
import s3 from '../utils/aws-s3.js'
import Image from '../models/Image.js'
import Memory from '../models/Memory.js'
import upload from '../middleware/multer.js'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
const router = express.Router()

router.post(
    '/upload-user-img',
    authMiddleware,
    upload('user-images').single('image'),
    async (req, res) => {
        try {
            const { size, bucket, key, location } = req.file
            const newImg = await new Image({
                size,
                bucket,
                key,
                location,
            }).save()
            await incMemory(size)
            res.status(201).json({
                message: 'Img uploaded Successfully',
                data: newImg,
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
router.post(
    '/upload-site-img',
    adminMiddleware,
    upload('site-images').single('image'),
    async (req, res) => {
        try {
            const { size, bucket, key, location } = req.file
            const newImg = await new Image({
                size,
                bucket,
                key,
                location,
            }).save()
            await incMemory(size)
            res.status(201).json({
                message: 'Img uploaded Successfully',
                data: newImg,
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
