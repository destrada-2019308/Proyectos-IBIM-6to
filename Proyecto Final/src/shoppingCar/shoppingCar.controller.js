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
        let purchase = new ShoppingCar(data)
        let amount = purchase.amount
        if(stock < amount) return res.send({message: 'Dont exists the amount required'})
        await purchase.save()
        return res.send({message: `Purchase successfully`})

    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error registering purchase'})
    }
}

//Proceso de compra
//Completar el proceso de compra, presnetando la factura 
//Completed
//es un update de la compra
export const purchase = async(req, res) =>{
    try {
        let data = req.body
        let { id } = req.params
        //vamos a restar el stock de la cantida que ingreso
        
        let update = checkUpdatePurchase(data, id)
        if(!update) return res.status(401).send({message: 'Solo puede cambiar el status a completado'})
        let updatePurchase = await ShoppingCar.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        ).populate('user', ['name'], 'product', ['name'])
        if(!updatePurchase) return res.status(401).send({message: 'The purchase is nos found'})
        return res.send({message: 'Purchase is completed successfully', updatePurchase })
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error process purchase'})
    }
}

export const getPurchase = async(req, res) => {
    try {
        //Jalar las compras que tengan completed, va hacer lo del stock y lo va a mostrar en la factura
        let data = req.body
        let productId = data.product
        let product = await Product.findOne({_id: productId})
        let compra = await ShoppingCar.find({status: 'COMPLETED', product: productId})
        
        console.log(compra, product)
        console.log(compra.amount);
        console.log(product.stock);                                                                    
        //devuelve una factura donde muestre las cosas que compro el usuario
        return res.send({compra})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error getting purchase'})
    }
}

//Historial de compra
//historial de compra de usuarios