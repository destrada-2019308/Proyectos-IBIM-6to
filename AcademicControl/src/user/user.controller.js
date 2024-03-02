'use strict'

import User from './user.model.js'
import { checkPassword, checkUpdate, encrypt } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const test = (req, res) =>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const register = async(req, res) => {
    try {
        let data = req.body
        data.password = await encrypt(data.password) 
        data.role = 'STUDENT_ROLE'
        let user = new User(data)
        await user.save()
        return res.send({message: `Register successfully, can be logged with user ${user.username}`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error registering user', err})
    }
}

//usuario por defecto cuando usamos npm run dev o node index.js
export const userDefect = async(req,res) =>{
    try {
        const userExists = await User.findOne({username: 'admin'})
        if(userExists){
           console.log('usuario existente')
        }else{
        const encryptPassword = await encrypt('admin1234')
        const newUser = new User({
            name: 'admin',
            surname: 'admin',
            username: 'admin',
            password: encryptPassword,
            email: 'admin',
            phone: '12345678',
            role: 'TEACHER_ROLE'
        }) 
        await newUser.save()
    }   
    } catch (err) {
        console.error(err)
    }
}

export const login = async(req, res) => {
    try {
        let {username, password} = req.body
        let user = await User.findOne({username: username})
        if(user && await checkPassword(password, user.password)){
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
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

export const registerTeacher = async(req, res)=>{
    try{
        //Obtener el id del usuario para actualizar
        let { id } = req.params
        //obtener los datos a actualizar
        const { role } = req.body;

        // Validar que solo se esté intentando actualizar el campo 'role'
        if (Object.keys(req.body).length !== 1 || !role) {
          return res.status(400).send({ message: 'Solo se puede actualizar el campo role' });
        }
        //Validar si tiene permisos (tokenización) X hoy no lo vemos X
        //Actualizar la db
        let updatedUser = await User.findOneAndUpdate(
            //va a buscar un solo registro
            {_id: id},  //ObjectId <- hexadecimales(hora sys, version mongo, llave privada...)
            { role }, //los datos que se van a actualizar 
            {new: true}
        )
        //Validar la actualización
        if(!updatedUser) return res.status(401).send({message: 'User not found and not update'})
        //Responde al usuario
        return res.send({message: `Update user`, updatedUser})
    }catch(err){
        console.error(err)
        if(err.keyValue.username)return res.status(400).send({message: `Username ${err.keyValue.username} is alredy exists`})
        return res.status(500).send({message: `Error updating account`})
    }
}

export const updateStudent = async(req, res) =>{
    try {
        let { id } = req.params
        let data = req.body
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be update'})
        let updatedUser = await User.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updatedUser) return res.status(401).send({message: 'User not found and not update'})
        return res.send({message: 'Update user', updatedUser})
    } catch (err) {
        console.error(err)
        if(err.keyValue.username)return res.status(400).send({message: `Username ${err.keyValue.username} is alredy exists`})
        return res.status(500).send({message: `Error updating account`})
    }
}

export const deleteA = async(req, res) =>{
    try{
        //Capturar el id del estudiante a eliminar
        let { id } = req.params
        //Eliminar 
        let deletedStudent = await User.deleteOne({_id: id})
        //validar que se eliminó
        if(deletedStudent.deleteCount === 0 ) return res.status(404).send({message: 'Student not found and not deleted'})
        //Respondemos al usuario
        return res.send({message: 'Deleted student successfully'})
    }catch(err){
        console.error(err)
        return res.status(404).send({message: 'Error deleting student'})
    }
}