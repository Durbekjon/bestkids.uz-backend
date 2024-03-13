import { S3 } from '@aws-sdk/client-s3'
import * as dotenv from 'dotenv'
dotenv.config()
const s3 = new S3({
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    region: process.env.S3_BUCKET_REGION,
})
export default s3
