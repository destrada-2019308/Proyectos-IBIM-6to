'use strict'
//import { checkUpdate  } from "../utils/validator"
import Course from './course.model.js'
import User from '../user/user.model.js'
import Assign from '../assign/assign.model.js'
import { checkUpdate } from '../utils/validator.js'

export const saveCourse = async (req, res) =>{
    try{
        // Capturar el nombre del curso desde el body
        let data = req.body
        let { teacherId } = req.body
        const teacher = await User.findOne({_id: data.teacher})
        const findCourse = await Course.find({_id: teacher})
        if(!teacher) return res.status(404).send({message: 'Teacher not found'})
        const existsCourse = await Course.findOne({ name: data.name });
        if (existsCourse) {
            return res.status(400).send({message: `A course alredy exists`});
        }
        // Crear una nueva instancia de Course solo con el nombre
        let course = new Course(data);
        // Guardar el curso
        await course.save();
        // Responder al usuario
        return res.send({ message: `The course ${data.name} is register successfully` });
    } catch(err){
        console.error(err);
        return res.status(500).send({ message: 'could not register', err: err });
    }
}

export const updatedCourse = async(req, res)=>{
    try {
        //Capturar la data
        let data = req.body
        //Capturar el id del animal a actualizar
        let { id } = req.params
        //Validar que vengan datos
        let update = checkUpdate(data, false)
        if(!update) return res.status(400).send({message: 'Have sumitted some data that cannot be updated or missing data'})
        //Actualizar
        let updatedCourse = await Course.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        ).populate(['name'])//Elimianr la informacion sensible
        //Validar la actualizacion
        if(!updatedCourse) return res.status(404).send({message: 'Course not found and not updated'})
       
        //Responder si todo sale bien
        return res.send({message: 'Course updated successfully', updatedCourse})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error updating course'})
    }
}

export const deleteCourse = async(req, res) =>{
    try{
        let { id } = req.params
        //Buscar a las asignaciones que tiene el curso 
        const assignCourse = await Assign.find({course: id})
        //Eliminar cada asignacion 
        for(const assignment of assignCourse){
            await assignment.deleteOne()
        }
        //Eliminar
        let deletedCourse = await Course.findOneAndDelete({_id: id})
        if(!deletedCourse) return res.status(404).send({message: 'Course not found and not deleted'})
        //Respondemos al usuario
        return res.send({message: 'Deleted course successfully'})
    }catch(err){
        console.error(err)
        return res.status(404).send({message: 'Error deleting course'})
    }
}

export const search = async(req, res) => {
    try{
        //Obtener el parámetro de búsqueda
        let { search } = req.body
        //Bsucar
        let courses = await Course.find(
            {teacher: search}
        ).populate('teacher', ['name', 'cost'])
 
        //validar la respuesta
        if(!courses) return res.status(404).send({message: 'Courses not found '})
        //responder si todo sale bien
        return res.send({message: 'Courses found', courses})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error searching Courses'})
    }
}