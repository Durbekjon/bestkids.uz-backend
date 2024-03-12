import express from 'express'
import upload from '../middleware/multer.js'
import Image from '../models/Image.js'
import Memory from '../models/Memory.js'
import fs from 'fs'
const router = express.Router()

router.post(
    '/upload-user-img',
    upload('user-images').single('image'),
    async (req, res) => {
        try {
            const { filename, size } = req.file

            const newImg = new Image({ name: filename, size })
            await incMemory(newImg.size)
            await newImg.save()

            return res.status(201).json({
                message: 'Image uploaded successfully',
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
    upload('site-images').single('image'),
    async (req, res) => {
        try {
            const { filename, size } = req.file
            const newImg = new Image({ name: filename, size })
            await incMemory(newImg.size)
            await newImg.save()

            return res.status(201).json({
                message: 'Image uploaded successfully',
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
        const img = await Image.findById(req.params.id)

        if (!img) {
            return res.status(404).json({
                message: 'Image not found',
                success: false,
            })
        }

        fs.unlinkSync(`./uploads/${img.name}`)

        await decMemory(img.size)

        await Image.findByIdAndDelete(img.id)

        return res.status(200).json({
            message: 'Image deleted successfully',
            success: true,
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