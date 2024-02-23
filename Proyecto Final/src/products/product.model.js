'use strict'

import { Schema, model } from "mongoose";

const productSchema = Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    categories:{
        type: Schema.ObjectId,
        ref: 'categories',
        required: true
    },
},
{
    versionKey: false
})

export default model('product', productSchema)



