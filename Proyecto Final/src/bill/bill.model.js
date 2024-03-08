'use strict'

import {Schema, model} from 'mongoose'

const billSchema = Schema({
    date: {
        type: Date,
        required: true
    },
    cart: {
        type: Schema.ObjectId,
        ref: 'shoppingCar',
        required: true
    },
    total: {
        type: Number,
        required: true
    }
},
{
    versionKey: false
})

export default model('bill', billSchema )