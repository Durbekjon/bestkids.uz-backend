import Image from '../models/Image.js'
import News from '../models/News.js'
import {
    bad,
    created,
    deleted,
    errorHandler,
    get,
    notFound,
    updated,
} from './responsController.js'

const create = async (req, res) => {
    try {
        const { title, description, userId, image, date } = req.body

        if (!title || !description || !userId || !image || !date) {
            return bad(res, 'Missing required fields')
        }

        const newNews = new News({
            title,
            description,
            author: userId,
            image,
            date,
        })
        await newNews.save()

        // Update the image reference
        await Image.findByIdAndUpdate(image, { for: 'news' })

        return created(res, 'News', newNews)
    } catch (error) {
        return errorHandler(res, error)
    }
}

const getAll = async (req, res) => {
    try {
        const news = await News.find()
        return get(res, 'News', news)
    } catch (error) {
        return errorHandler(res, error)
    }
}

const getOne = async (req, res) => {
    try {
        const id = req.params.id

        if (!id) {
            return bad(res, 'News Id')
        }

        const news = await News.findById(id)

        if (!news) {
            return notFound(res, 'News')
        }

        return get(res, 'News', news)
    } catch (error) {
        return errorHandler(res, error)
    }
}

const update = async (req, res) => {
    try {
        const id = req.params.id

        if (!id) {
            return bad(res, 'News Id')
        }

        let news = await News.findById(id)

        if (!news) {
            return notFound(res, 'News')
        }

        const { title, description, image, date } = req.body

        // Validate required fields
        if (!title || !description || !image || !date) {
            return bad(res, 'Missing required fields')
        }

        // Update news
        news = await News.findByIdAndUpdate(
            id,
            {
                title,
                description,
                image,
                date,
            },
            { new: true },
        )

        // Update the image reference
        await Image.findByIdAndUpdate(image, { for: 'news' })

        return updated(res, 'News', news)
    } catch (error) {
        return errorHandler(res, error)
    }
}

const deleteOne = async (req, res) => {
    try {
        const id = req.params.id

        if (!id) {
            return bad(res, 'News Id')
        }

        let news = await News.findById(id)

        if (!news) {
            return notFound(res, 'News')
        }

        // Update the image reference
        await Image.findByIdAndUpdate(news.image, { for: 'noactive' })

        // Delete news
        await News.findByIdAndDelete(id)

        return deleted(res, 'News')
    } catch (error) {
        return errorHandler(res, error)
    }
}

export { create, getAll, getOne, update, deleteOne }
