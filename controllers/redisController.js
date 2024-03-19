import client from '../config/redisConfig.js'
import express from 'express'
import { defaultRes, errorHandler } from './responsController.js'

const res = express.response

const cacheVerCode = async (email, code) => {
    try {
        await client.flushAll()
        const cache = {
            email,
            code,
        }
        await client.set(`${email}-${code}`, JSON.stringify(cache)) // Removed unnecessary spread operator
    } catch (error) {
        return errorHandler(res, error) // Return the error
    }
}

const checkVerCode = async (email, code) => {
    try {
        const response = await client.get(`${email}-${code}`)
        return !!response // Simplified logic to return boolean directly
    } catch (error) {
        return errorHandler(res, error) // Return the error
    }
}

const verUser = async (email) => {
    try {
        await client.set(`verified-${email}`, 'successfully') // Added a value to set
    } catch (error) {
        return errorHandler(res, error) // Return the error
    }
}

const checkUser = async (email) => {
    try {
        const check = await client.get(`verified-${email}`)
        if (!check) {
            console.log(check)
            return false
        }
        // If the key exists, delete it
        await client.del(`verified-${email}`)
        return true // Return true after deleting the key
    } catch (error) {
        return errorHandler(res, error) // Return the error
    }
}

export { cacheVerCode, checkVerCode, verUser, checkUser }
