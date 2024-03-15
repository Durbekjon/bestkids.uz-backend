import multer from 'multer'
import fs from 'fs'
import path from 'path'

const storage = (folder) => {
    // Check if the folder exists, create it if it doesn't
    const folderPath = path.resolve(folder)
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true })
    }

    return multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, folderPath)
        },
        filename: function (req, file, cb) {
            const uniqueSuffix =
                Date.now() + '-' + Math.round(Math.random() * 1e9)
            cb(null, `${uniqueSuffix}.${file.originalname.split('.').pop()}`)
        },
    })
}

const upload = (folder) => multer({ storage: storage(folder) })

export default upload
