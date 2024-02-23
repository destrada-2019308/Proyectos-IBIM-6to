'use stict'

import Categories from '../categories/categories.model.js'
import Products from './product.model.js'

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
        //let update = 
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
            {name: search}
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