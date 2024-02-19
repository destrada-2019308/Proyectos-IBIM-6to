import { Schema, model } from "mongoose";

const assignmentSchema = Schema({
    course: {
        type: Schema.ObjectId,
        require: true,
        ref: 'course'
    },
    student: {
        type: Schema.ObjectId,
        require: true,
        ref: 'user'
    }
},{
    versionKey: false
})

export default model('assignment', assignmentSchema)



