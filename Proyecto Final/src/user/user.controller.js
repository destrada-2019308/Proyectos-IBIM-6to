'use strict'

import User from './user.model.js'
import { encrypt, checkPassword, checkUpdate, checkUpdateRole } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

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

//Update de admin 
export const updateAdmin = async(req, res) =>{
    try {
        //traemos la info 
        let data = req.body
        //buscamos el id de arriba
        let { id } = req.params
        //console.log(id)
        let secretKey = process.env.SECRET_KEY
        let token  = req.headers.authorization
        const {uid} = jwt.verify(token, secretKey); 

        //console.log(uid);
        if(uid != id) return res.status(404).send({message: 'No puedes editar a otro admin'})
        let updatedAdmin = await User.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updatedAdmin) return res.status(404).send({message: `User not found and not updated`})       
        return res.send({message: `Admin updated successfully`, updatedAdmin})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error updating admin'})
    }
}

        // que el cualquier admin pueda editar a un cliente menos la contra 
export const updateClient = async(req, res) =>{
    try {
        let { id } = req.params
        let data = req.body
        // Verificar si se proporciona la contraseña antigua y la nueva contraseña
        /*if ('oldPassword' in data && 'newPassword' in data) {
            const { oldPassword, newPassword } = req.body;
            // Verificar si se proporciona la contraseña antigua y la nueva contraseña
            if (!oldPassword || !newPassword) {
                return res.status(400).json({ message: 'Se requieren la contraseña antigua y la nueva contraseña' });
            }
     
            // Buscar al usuario por ID y contraseña antigua
            const user = await User.findOne({ _id: id});
     
            if (!user) {
                return res.status(401).json({ message: 'La contraseña antigua es incorrecta o el usuario no fue encontrado' });
            }
            // Verificar si la contraseña antigua es correcta
            const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordCorrect) {
                return res.status(401).json({ message: 'La contraseña antigua es incorrecta' });
            }
    
            // Verificar que la nueva contraseña cumpla con los requisitos mínimos
            if (newPassword.length < 8) {
                return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 8 caracteres' });
            }
            let nuevacontra = await encrypt(newPassword)
            // Actualizar la contraseña del usuario
            const updatedUser = await User.findByIdAndUpdate(id, { password: nuevacontra }, { new: true });
     
            if (!updatedUser) {
                return res.status(500).json({ message: 'Error al actualizar la contraseña del usuario' });
            }
        }*/
        //Validar que vengan datos
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have sumitted some data that cannot be updated or missing data'})
        let updatedClient = await User.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updatedClient) return res.status(401).send({message: 'User not found and not updated'})
        return res.send({message: `Client updated successfully`, updatedClient})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error updating client'})
    }
}

// y que el cliente se puede editar a si mismo, no puede cambiar el rol
export const updateUserClient = async(req, res) =>{
    try {
        //traemos la info 
        let data = req.body
        //buscamos el id de arriba
        let { id } = req.params
        //console.log(id)
        let secretKey = process.env.SECRET_KEY
        let token  = req.headers.authorization
        const {uid} = jwt.verify(token, secretKey);
        let update = checkUpdateRole(data, id)
        if(!update) return res.status(400).send({message: 'Have sumitted some data that cannot be updated or missing data'})
        //console.log(uid);
        if(uid != id) return res.status(404).send({message: 'El cliente no coincide con el inicio de sesión'})
        let updatedClient = await User.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updatedClient) return res.status(404).send({message: `User not found and not updated`})       
        return res.send({message: `Client updated successfully`, updatedClient})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error updating admin'})
    }
}

//Elimine usuarios
// Elimine el cliente con la autokenizacion y el admin

export const deleteClient = async(req, res) =>{
    try {
        const { id } = req.params
        let { password } = req.body
        //const { userId } = req.body//Si el id del usuario lo envia por el request
        //Busca la publicación por id
        let secretKey = process.env.SECRET_KEY
        let token  = req.headers.authorization
        const {uid} = jwt.verify(token, secretKey); 
        //console.log(uid);
        if(uid != id) return res.status(404).send({message: 'No puedes eliminar a otro client'})
        const clientId = await User.findOne({_id: id})
        if(!clientId) return res.status(404).send({message: `Client not found`})
        //console.log(clientId.password);
        //Verfica que la contraseña sea correcta
        const verifyPassword = await bcrypt.compare(password, clientId.password);
        //console.log(verifyPassword);
            if (verifyPassword === false) {
                return res.status(401).send({ message: 'La contraseña es incorrecta' });
            }
        //Verificamos que el usuario tenga el permiso de eliminar el post
        //if(clientId._id.toString() !== id) return res.status(403).send({message: `You're not authorized to delete this client`})
        //Eliminamos el post
        const deletedClient = await User.deleteOne({_id: id})
        if(deletedClient.deletedCount === 0) return res.status(404).send({message: 'Client not found and not deleted'})
        return res.send({message: `Deleted client successfully`})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error deleting client'})
    }
}

export const deleteAdmin = async(req, res) =>{
    try {
        const { id } = req.params
        let { password } = req.body
        //const { userId } = req.body//Si el id del usuario lo envia por el request
        //Busca la publicación por id
        let secretKey = process.env.SECRET_KEY
        let token  = req.headers.authorization
        const {uid} = jwt.verify(token, secretKey); 
        //console.log(uid);
        if(uid != id) return res.status(404).send({message: 'No puedes editar a otro admin'})
        const adminId = await User.findOne({_id: id})
        if(!adminId) return res.status(404).send({message: `Admin not found`})
        //Verfica que la contraseña sea correcta
        const verifyPassword = await bcrypt.compare(password, adminId.password);
        //console.log(verifyPassword);
            if (verifyPassword === false) {
                return res.status(401).send({ message: 'La contraseña es incorrecta' });
            }
        //Eliminamos el post
        const deleteAdmin = await User.deleteOne({_id: id})
        if(deleteAdmin.deletedCount === 0) return res.status(404).send({message: 'Admin not found and not deleted'})
        return res.send({message: `Deleted admin successfully`})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error deleting admin'})
    }
}