'use strict'

import jwt from 'jsonwebtoken'
const secretKey = '@LlaveSuperSecretaDePractica2@'

export const generateJwt = async(payload) =>{
    try {
        return jwt.sign(payload, secretKey, {
            expiresIn: '4h',
            algorithm: 'HS256'
        })
    } catch (err) {
        console.error(err)
        return err
    }
}