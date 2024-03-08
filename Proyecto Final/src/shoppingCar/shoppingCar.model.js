'use strict'

import { Schema, model } from 'mongoose'

const shoppingCarSchema = Schema({
    product: {
        type: Schema.ObjectId,
        ref: 'product',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['CREATED', 'CANCELED', 'COMPLETED'],
        default: 'CREATED',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'user',
        required: true
    }
},{
    versionKey: false
})

export default model('shoppingCar', shoppingCarSchema)