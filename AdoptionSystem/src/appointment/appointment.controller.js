'use strict' 

import Animal from './appointment.model.js'

export const test = async(req, res)=>{
    return res.send({message: 'Function test is running | appointment'})
}

export const save = async(req, res) => {
    try {
        //Capturar la data
        let data = req.body
        data.user = req.user._id //Traer el id del usuario loggeado
        //Verificar que exista el animal
        let animal = await Animal.findOne({_id: data.animal})
        if(!animal) return res.status(404).send({message: 'Animal not found'})
        //Validar que la mascota no tenga una cita activa con esa persona
        /*Ejercicio: que el usuario solo pueda tener una cita por dia*/
        //Guardar
        let appointment = new Appointment(data)
        await appointment.save()
        return res.send({message: `Appointment saved successfully for the data ${appointment.date}`})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error creating appointment', error})
    }
}