const created = async (res, name, data) => {
    return res.status(201).json({
        message: `${name} created successfully`,
        data,
        success: true,
    })
}
const updated = async (res, name, data) => {
    return res.status(200).json({
        message: `${name} updated successfully`,
        data,
        success: true,
    })
}

const deleted = async (res, name) => {
    return res.status(200).json({
        message: `${name} deleted successfully`,
        success: true,
    })
}

const get = (res, name, data) => {
    return res.status(200).json({
        message: `${name} GET successfully`,
        data,
        success: true,
    })
}

const notFound = async (res, name) => {
    return res.status(404).json({
        message: `${name} not found`,
        success: true,
    })
}

const errorHandler = (res, error) => {
    console.log(error)
    return res.status(500).json({
        message: error.message,
        success: false,
    })
}
const defaultRes = (res, status, message) => {
    return res.status(status).json({
        message,
        success: false,
    })
}

const bad = (res, fields) => {
    return res.status(403).json({
        message: `${fields} required`,
    })
}

export {
    created,
    updated,
    get,
    deleted,
    notFound,
    errorHandler,
    defaultRes,
    bad,
}
