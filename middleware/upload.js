import upload from '../middleware/multer.js'

const uploadFolder = (req, res, next) => {
    const folder = req.params.folder
    if (req.files && req.files.length === 1) {
        upload(folder).single('image')(req, res, next)
    } else {
        upload(folder).array('image', 10)(req, res, next)
    }
}
export default uploadFolder
