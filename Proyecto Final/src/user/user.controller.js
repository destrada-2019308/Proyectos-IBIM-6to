'use strict'

import User from './user.model.js'
import { encrypt } from '../utils/validator.js'

export const test = (req, res) =>{
    return res.send({message: 'Test is running'})
}

export const register = async(req, res) =>{
    try {
        let data = req.body
        //Encriptamos la password
        data.password = await encrypt(data.password)
        data.role = 'CLIENT'
        let user = new User(data)
        await user.save()
        return res.send({message: `Register successfully, can be logged with username use ${user.username}`})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error register user'})
    }
}
 