'use strict'

import Categories from './categories.model.js'

export const test = (req, res) => {
    console.log('test is running')
    return res.send({message: 'Test is running'})
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

export const deleteCategories = async(req, res) =>{
    try {
        let { id } = req.params
        let deletedCat = await Categories.findOneAndDelete({_id: id})
        if(!deletedCat) return res.status(404).send({message: 'Categories not found and not delete'})
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