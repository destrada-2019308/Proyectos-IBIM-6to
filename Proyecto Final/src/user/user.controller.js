'use strict'

import User from './user.model.js'
import { encrypt, checkPassword } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const test = (req, res) =>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const login = async(req, res) => {
    try {
        let {account, password} = req.body
        let user = await User.findOne({
            $or: [
                {username: account},
                {email: account}
            ]
        })
        if(user && await checkPassword(password, user.password)){
            let loggedUser = {
                uid: user._id,
                name: user.name,
                username: user.username,
                role: user.role
            }
            let token = await generateJwt(loggedUser)
            return res.send(
                {message: `Welcome ${loggedUser.name}`
                , loggedUser, token})
        }
        return res.status(400).send({message: `User not found`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error to login'})
    }
}

//usuario por defecto cuando usamos npm run dev o node index.js
export const userDefect = async(req,res) =>{
    try {
        const userExists = await User.findOne({username: 'admin'})
        if(userExists){
           console.log('usuario existente')
        }else{
        const encryptPassword = await encrypt('admin123')
        const newUser = new User({
            name: 'admin',
            surname: 'admin',
            username: 'admin',
            password: encryptPassword,
            email: 'admin',
            phone: '12345678',
            role: 'ADMIN'
        }) 
        await newUser.save()
    }   
    } catch (err) {
        console.error(err)
    }
} 

export const registerClient = async(req, res) =>{
    try {
        let data = req.body
        let findUser =  await User.findOne({
            $or: [
                {username: data.username},
                {email: data.email}
            ]
        })
        if(findUser) return res.status(403).send({message: `El usuario ${data.username} ya existe o el email ${data.email} ya existe\n Porfavor ingrese un usuario o email que no exista`})
        data.password = await encrypt(data.password) 
        data.role = 'CLIENT'
        let user = new User(data)
        await user.save()
        return res.send({message: `Register successfully, can be logged with user ${user.username}`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error registering user', err})
    }
}

//solo admin
export const createUser = async(req, res) =>{
    try {
        let data = req.body
        data.password = await encrypt(data.password) 
        let findUser =  await User.findOne({
            $or: [
                {username: data.username},
                {email: data.email}
            ]
        })
        if(findUser) return res.status(403).send({message: `El usuario ${data.username} ya existe o el email ${data.email} ya existe\n Porfavor ingrese un usuario o email que no exista`})
        let user = new User(data)
        await user.save()
        return res.send({message: `Register successfully, can be logged with user ${user.username}`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error registering user', err})
    }
}


