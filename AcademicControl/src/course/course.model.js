import { Schema, model } from "mongoose";

const courseSchema = Schema({
    name:{
        type: String,
        require: true
    },
    cost: {
        type: Number,
        require: true
    },
    grade: {
        type: String,
        require: true
    },
    teacher: {
        type: Schema.ObjectId,
        require: true,
        ref: 'user'
    }
},
{
    versionKey: false
})

export default model('course', courseSchema)