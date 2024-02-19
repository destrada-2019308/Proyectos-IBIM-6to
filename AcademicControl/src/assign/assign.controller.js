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
        let course = await Course.findOne({_id: data.curso})
        if(!course) return res.status(404).send({message: 'Course not found'})
        let user = await User.findOne({_id: data.students})
        if(!user) return res.status(404).send({message: 'Student not found'})
        const studentId = data.students;
        const courseCount = await Assing.countDocuments({ students: studentId }).populate('students', ['username'])
        if (courseCount >= 3) {
            return res.status(400).send({message: `The studento with ${studentId} is alredy exists in 3 courses.`});
        }
         const existingCourse = await Assing.findOne({ students: studentId, name: data.name });
        if (existingCourse) {
            return res.status(400).send({message: `The studento with ${studentId} i aslredy exists with course: ${data.name}.`});
        }
        let assing = new Assing(data)
        await assing.save()
        return res.send({message: `The course is register successfully`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Course is not save', err: err})
    }
}







