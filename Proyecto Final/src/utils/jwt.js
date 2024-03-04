'use strict'

import jwt from 'jsonwebtoken'


export const generateJwt = async(payload) =>{
    try {
        const secretKey = process.env.SECRET_KEY
        return jwt.sign(payload, secretKey, {
            expiresIn: '4h',
            algorithm: 'HS256'
        })
    } catch (error) {
        console.error(error)
        return error
    }
}