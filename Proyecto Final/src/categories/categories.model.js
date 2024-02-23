import mongoose from "mongoose"

const categoriesSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
},
{
    versionKey: false
})

export default mongoose.model('categories', categoriesSchema)