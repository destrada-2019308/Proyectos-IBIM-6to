'use strict'

import ShoppingCar from './shoppingCar.model.js'
import User from '../user/user.model.js'
import Product from '../products/product.model.js'
import jwt from 'jsonwebtoken'
import { checkUpdatePurchase } from '../utils/validator.js'

export const test = (req, res) =>{
    return res.send({message: 'Test is running'})
}

export const addToCart = async(req, res) => {
    try {
        //Capturamos la data
        let data = req.body
        //Verificamos que exista el usuario 
        let user = await User.findOne({_id: data.user})
        //Asi también como le producto
        let product = await Product.findOne({_id: data.product})
        let stock = product.stock
        if(!user) return res.status(404).send({message: 'User not found'})
        if(!product) return res.status(404).send({message: 'Product not found'})
        //validamos que el usuario que hace la compra sea el mismo 
        //si el producto existe en otra compra que solo agrege la cantidad 
        let secretKey = process.env.SECRET_KEY
        let token  = req.headers.authorization
        const {uid} = jwt.verify(token, secretKey);
        if(uid !== data.user) return res.status(401).send({message: `Enter your ID to make a purchase`})
        if(stock === 0 ) return res.status(404).send({message: 'We do not have that product available'})
        //Instanciamos la clase
        //let purchase = new ShoppingCar(data)
        //Creamos la validacion de que si tiene 2 productos iguales los sume en un purchase
        let cart = await ShoppingCar.findOne({user: data.user, product: data.product})
        if(cart){
            cart.amount = +cart.amount + +data.amount
        }else{
            //Si no existe, creamos uno nuevo
            cart = new ShoppingCar({
                product: data.product,
                amount: data.amount,
                status: 'CREATED',
                date: new Date(),
                user: data.user
            })
        }
        let amount = cart.amount
        if(stock < amount) return res.send({message: 'Dont exists the amount required'})
        await cart.save()
        return res.send({message: `Purchase successfully`})

    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error registering purchase'})
    }
}

//Historial de Compra: Al iniciar sesión, los usuarios pueden acceder a un historial completo de sus compras
//anteriores.

export const getPurchase = async(req, res) =>{
    try {
        let { search } = req.body
        let purchase = await ShoppingCar.find({user: search, status: 'COMPLETED'}).populate('user', ['name'])
        if(!purchase) return res.status(404).send({message: 'Purchase not found'})
        return res.send({message: 'Purchase found', purchase})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error getting purchase'})
    }
}