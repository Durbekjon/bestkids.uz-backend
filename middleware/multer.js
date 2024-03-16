import { fileURLToPath } from 'url'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Storage configuration function
const storage = (dir) => {
    const dirPath = path.join(__dirname, 'uploads', dir)

    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
    }

    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, dirPath)
        },
        filename: (req, file, cb) => {
            const uniqueSuffix =
                Date.now() + '-' + Math.round(Math.random() * 1e9)
            cb(null, `${uniqueSuffix}.${file.originalname.split('.').pop()}`)
        },
    })
}

// Function to initialize multer upload
const upload = (dir) => multer({ storage: storage(dir) })

export default upload
