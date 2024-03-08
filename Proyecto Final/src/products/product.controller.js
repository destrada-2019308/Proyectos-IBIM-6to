'use stict'

import Categories from '../categories/categories.model.js'
import Products from './product.model.js'
import ShoppingCart from '../shoppingCar/shoppingCar.model.js'
import { checkUpdateProduct } from '../utils/validator.js'

export const test = (req, res) => {
    return res.send({message: 'Test is running'})
}

export const saveProduct = async(req, res) => {
    try {
        let data = req.body
        let cat = await Categories.findOne({_id: data.categories})
        if(!cat) return res.status(404).send({message: 'Categories not found'})
        let product = new Products(data)
        await product.save()
        return res.send({message: 'register is successfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Product is not save ', error: error})
    }
}

export const showAll = async(req, res) => {
    try {
        let product = await Products.find()
        return res.send({product})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error getting products'})
    }
}

export const updateProduct = async(req, res) => {
    try {
        let data = req.body
        let { id }= req.params
        //Validamos que vengan datos
        let { stock } = await Products.findOne({_id: id})
        let update = checkUpdateProduct(data, false)
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
        data.stock = parseInt(stock) + parseInt(data.stock)
        let updatedProduct = await Products.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        ).populate('categories',['name, brand'])
        if(!updatedProduct) return res.status(404).send({message: 'Producto not found and not update'})
        return res.send({message: `Producto updated successfully`, updatedProduct})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error updating product'})
    }
}

export const deleteProduct = async(req, res) =>{
    try{
        let { id } = req.params
        let deletedProduct = await Products.deleteOne({_id: id})
        //validar que se eliminó
        if(deletedProduct.deleteCount === 0 ) return res.status(404).send({message: 'Product not found and not deleted'})
        //Respondemos al usuario
        return res.send({message: 'Deleted product successfully'})
    }catch(err){
        console.error(err)
        return res.status(404).send({message: 'Error deleting product'})
    }
}

export const search = async(req, res) => {
    try{
        //Obtener el parámetro de búsqueda
        let { search } = req.body
        //Bsucar
        let products = await Products.find(
            {_id: search}
        ).populate( 'name')
        //validar la respuesta
        if(!products) return res.status(404).send({message: 'Products not found '})
        //responder si todo sale bien 
        return res.send({message: 'Products found', products})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error searching products'})
    }
}

//Filtros
//Productos mas vendidos
export const infoProducMasVendidos = async(req, res) => {
    try {
        let ventasProductos = await ShoppingCart.aggregate([
            { $group: 
                { _id: "$product", 
                    totalVendido: { $sum: "$amount" }
                }},//el id especidica el campo a agrupar
            { $sort: 
                { totalVendido: -1 }},
            { $limit: 5 }
           //Hacemos una union entre 2 colecciones  
        ]).lookup({ from: 'products', localField: '_id', foreignField: '_id', as: 'product' });

        return res.send({ventasProductos})
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error getting Products' })
    }
}


//muestre productos agotados (sin stock)

export const productoOutOfStock = async(req, res) => {
    try {
        let product = await Products.find({stock: 0})
        return res.send({product})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error getting products'})
    }
}

export const getInventary = async(req, res)=>{        
    try{
        let products = await Products.find().populate('categories'); 
        return res.send({ products })
    }catch(err){
        console.error(err)
        return res.status(500).send({ message: 'Error getting Products' })
    }
}

//EXPLORACION DE PRODUCTOS 
export const productosMasVendidos = async(req, res) => {
    try {
        let ventasProductos = await ShoppingCart.aggregate([
            { $group: 
                { _id: "$product", 
                    totalVendido: { $sum: "$amount" }
                }},//el id especidica el campo a agrupar
            { $sort: 
                { totalVendido: -1 }},
            { $limit: 10 }
           //Hacemos una union entre 2 colecciones  
        ]).lookup({ from: 'products', localField: '_id', foreignField: '_id', as: 'product' });

        return res.send({ventasProductos})
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error getting Products' })
    }
}

export const searchName = async(req, res) => {
    try{
        //Obtener el parámetro de búsqueda
        let { search } = req.body
        //Bsucar
        let products = await Products.find({name: search}).populate( 'name')
        //validar la respuesta
        if(!products || products.length === 0) return res.status(404).send({message: 'Products not found '})
        //responder si todo sale bien 
        return res.send({message: 'Products found', products})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error searching products'})
    }
}