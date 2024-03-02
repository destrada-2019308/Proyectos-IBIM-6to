'use strict'

import Assignment from './assign.model.js'
import Course from '../course/course.model.js'
import User from '../user/user.model.js'

export const test = (req, res) => {
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const assingCourse = async (req, res) => {
    try{
        let data = req.body
        let course = await Course.findOne({_id: data.course})
        if(!course) return res.status(404).send({message: 'Course not found'})
        let user = await User.findOne({_id: data.student})
        if(!user) return res.status(404).send({message: 'Student not found'})
        const studentId = data.student;
        const courseId = data.course
        
        const existingCourse = await Assignment.findOne({ course: courseId});
        const userAssignmentsCount = await Assignment.countDocuments({ student: studentId });
        if (userAssignmentsCount >= 3) {
            return res.status(400).send({ message: 'El usuario ya tiene 3 asignaciones' });
        }
        if (existingCourse) {
            return res.status(400).send({message: `The student with ${studentId} i aslredy exists with course: ${data.course}.`});
        }
       // if(courseCount >= 3 || existingCourse) return res.status(400).send({message: `The student is alredy exists in 3 course and exists wit only course`});
        let assing = new Assignment(data)
        await assing.save()
        return res.send({message: `The course is register successfully`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Course is not save', err: err})
    }
}

export const search = async(req, res) => {
    try{
        //Obtener el parámetro de búsqueda
        let { search } = req.body
        //Bsucar
        let courses = await Assignment.find(
            {student: search}
        )
 
        //validar la respuesta
        if(!courses) return res.status(404).send({message: 'Courses not found '})
        //responder si todo sale bien
        return res.send({message: 'Courses found', courses})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error searching Courses'})
    }
}





