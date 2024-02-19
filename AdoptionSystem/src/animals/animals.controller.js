'use strict'
import { checkUpdate } from '../utils/validator.js'
import Animal from './animals.model.js'
import User from '../user/user.model.js'

export const test = (req, res)=>{
    console.log('test is running animal')
    return res.send({message: 'Test us running'})
}

export const save = async(req, res) =>{
    try{
        //Capturar la data
        let data = req.body
        //validar que el keeper exista 
        let user = await User.findOne({_id: data.keeper})
        if(!user) return res.status(404).send({message: 'Keeper not found'})
        //crear la instancia animal
        let animal = new Animal(data)
        //guardar el animal 
        await animal.save()
        //responder al usuario
        return res.send({message: `register is successfully`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Animal is not save', err: err})
    }
}
/*
export const aListar = (req, res) => {
    try{
        let animal = Animal.find({animal})
        let listAnimals = {
            name: animal.name,
            owner: animal.owner,
            race: animal.race,
            size: animal.size,
            age: animal.age
        }
        return res.send({message: `List of everything collections`, listAnimals})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to list'})
    }
}*/

export const get = async(req, res)=>{
    try{
        let animals = await Animal.find()
        return res.send({animals})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error getting animals'})
    }
}

export const update = async(req, res)=>{
    try {
        //Capturar la data
        let data = req.body
        //Capturar el id del animal a actualizar
        let { id } = req.params
        //Validar que vengan datos
        let update = checkUpdate(data, false)
        if(!update) return res.status(400).send({message: 'Have sumitted some data that cannot be updated or missing data'})
        //Actualizar
        let updatedAnimal = await Animal.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        ).populate('keeper', ['name'])//Elimianr la informacion sensible
        //Validar la actualizacion
        if(!updatedAnimal) return res.status(404).send({message: 'Animal not found and not updated'})
       
        //Responder si todo sale bien
        return res.send({message: 'Animal updated successfully', updatedAnimal})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error updating animal'})
    }
}

/*
export const aUpdate = async(req, res) => {
    try{
        let { id } = req.params
        let data = req.bodylet
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: `Have submitted some data that cannot be updated`})
        let updateAnimal = await Animal.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updatedUser) return res.status(401).send({message: 'Animal not found and not update'})
        //Responde al usuario
        return res.send({message: `Update animal`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: `Error updating account`})
    }
}
*/

export const deleteA = async(req, res) =>{
    try{
        // X Verificar si tiene una reunion en proceso X
        //Capturar el id del animal a eliminar
        let { id } = req.params
        //Eliminar 
        let deletedAnimal = await Animal.deleteOne({_id: id})
        //validar que se eliminó
        if(deletedAnimal.deleteCount === 0 ) return res.status(404).send({message: 'Animal not found and not deleted'})
        //Respondemos al usuario
        return res.send({message: 'Deleted animal successfully'})
    }catch(err){
        console.error(err)
        return res.status(404).send({message: 'Error deleting animal'})
    }
}

export const search = async(req, res) => {
    try{
        //Obtener el parámetro de búsqueda
        let { search } = req.body
        //Bsucar
        let animals = await Animal.find(
            {name: search}
        ).populate('keeper', ['name', 'phone'])
        //validar la respuesta
        if(!animals) return res.status(404).send({message: 'Animals not found '})
        //responder si todo sale bien 
        return res.send({message: 'Animals found', animals})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error searching animals'})
    }
}