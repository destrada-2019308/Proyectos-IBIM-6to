'use strict'

import Categories from './categories.model.js'
import Product from '../products/product.model.js'

export const test = (req, res) => {
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const categoryDefault = async(req, res) =>{
    try {
        const categoryExists= await Categories.findOne({name: 'DefaultCategory'})
        if(categoryExists){
            console.log('The category is alredy exists')
        }else{
            const newCategory = new Categories({name: 'DefaultCategory', description: 'Default category'})
            await newCategory.save()
        }
    } catch (error) {
        console.error(error)
    }
}

export const saveCategories = async(req, res)=>{
    try {
        let data = req.body
        let categories = new Categories(data)
        let categoryName = await Categories.findOne({name: data.name})
        if(categoryName) return res.status(401).send({message: `The name (${data.name}) is already exists in other category, please give different name`})
        await categories.save()
        return res.send({message: `Register successfully, the categories register is ${categories.name}`})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error registering categories', error: error})
    }
}

export const updateCategories = async(req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        //Validamos que data no este vacío 
        let updatedCat = await Categories.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updatedCat) return res.status(401).send({message: 'Categories not found and not update'})
        return res.send({message: 'Update categories', updatedCat})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error updating categories'})
    }
}

/*en caso de que un producto este asociado a una categoria
que se requiera eliminar, el sistema asegura que el producto se transfiera automáticamente 
a una categoria predeterminada*/

export const deleteCategories = async(req, res) =>{
    try {
        let { id } = req.params           //findOneAndDelete
        let deletedCat = await Categories.findOneAndDelete({_id: id})
        if(!deletedCat || deletedCat.deleteCount === 0) return res.status(404).send({message: 'Categories not found and not delete'})
        const defaultCategory = await Categories.findOne({name: 'DefaultCategory'})
        if(!defaultCategory) return res.status(404).send({message: 'Default Category not found'})
        const product = await Product.updateMany({categories: id}, {categories: defaultCategory._id})
        if(!product) return res.status(404).send({message: 'Error transferring product to default category'})
        return res.send({message: `Categories ${deletedCat.name} delete successfully`})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error deleting categories'})
    }
}

export const search =  async(req, res) => {
    try {
        let { search } = req.body
        let categories = await Categories.find(
            {name: search}
        ).populate('name', 'description')
        if(!categories) return res.status(404).send({message: 'Categories not found'})
        return res.send({message: 'Categories found', categories})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error searching categories'})
    }
}

export const get = async(req, res)=>{
    try{
        let categories = await Categories.find()
        return res.send({categories})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error getting categories'})
    }
}

export const categorysExists = async(req, res)=>{
    try{
        let categories = await Categories.find()
        return res.send({categories})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error getting categories'})
    }
}

export const productCategory = async(req, res) =>{
    try {
        //muestre todos los poductos que tiene una categoria
        let { nameCategory } = req.body
        let category = await Categories.findOne({name: nameCategory})
        if(!category || category.length === 0) return res.status(401).send({message: 'Category not found'})
        let categoryId = category._id
        //console.log(categoryId);
        let product = await Product.find({categories: categoryId})
        return res.send({product})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error accessing category'})
    }
}