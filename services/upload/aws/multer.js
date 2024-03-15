import multer from 'multer'
import multerS3 from 'multer-s3'
import s3 from './aws-s3.js'
import * as dotenv from 'dotenv'
dotenv.config()
const upload = (dir) =>
    multer({
        storage: multerS3({
            s3,
            bucket: process.env.S3_BUCKET_NAME,
            metadata: function (req, file, cb) {
                cb(null, { fieldname: file.fieldname })
            },
            key: function (req, file, cb) {
                const uniqueSuffix = Math.round(Math.random() * 1e9)
                cb(
                    null,
                    `${dir}/${uniqueSuffix}.${file.mimetype.split('/')[1]}`,
                )
            },
        }),
    })
export default upload
