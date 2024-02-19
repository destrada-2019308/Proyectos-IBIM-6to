import { Schema, model } from "mongoose";

const animalSchema = Schema({
    name: {
        type: String,
        require: true
    },
    owner: {
        type: String,
        require: true
    },
    race: {
        type: String,
        require: true
    },
    size: {
        type: String,
        require: true,
    },
    age: {
        type: Number,
        require: true
    },
    keeper: {
        type: Schema.ObjectId, 
        lowerCase: true,
        require: true,
        ref: 'user'
    }
},
{
    versionKey: false //desahabilitar el __v (versión del docuemnto)
}
)

export default model('animals', animalSchema)