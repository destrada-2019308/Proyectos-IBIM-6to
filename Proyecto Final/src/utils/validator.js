'use strict'
import { hash, compare } from 'bcrypt'

export const encrypt = (password) =>{
    try {
        return hash(password, 10)
    } catch (error) {
        console.error(error)
        return error
    }
}

export const checkPassword = async(password, hash) =>{
    try {
        return await compare(password, hash)
    } catch (error) {
        console.error(error)
        return error
    }
}

export const checkUpdate = (data, userId)=>{
    if (userId){
        //validamos si data esta vacío   o 
        if(Object.entries(data).length === 0  
        || data.password 
        || data.password == ''){
            return false
        }
        return true
    }else{
        if(Object.entries(data).length === 0  
        || data.keeper 
        || data.keeper == '' ){
            return false
        }
        return true
    }
}

export const checkUpdateRole = (data, userId)=>{
    if (userId){
        //validamos si data esta vacío   o 
        if(Object.entries(data).length === 0  
        || data.role 
        || data.role == ''){
            return false
        }
        return true
    }
}

export const checkUpdateProduct = (data, productId)=>{
    if(productId){
        if(
            Object.entries(data).length === 0 ||
            data.name ||
            data.name == '' ||
            data.stock ||
            data.stock === ''        
        ) {
            return false
        }
        return true
    }else{
        if(
            Object.entries(data).length === 0 ||
            data.category ||
            data.category == ''
        ) {
            return false
        }
        return true
    }
}

export const checkUpdatePurchase = (data, purchaseId)=>{
    if(purchaseId){
        if(
            Object.entries(data).length === 0 ||
            data.amount ||
            data.amount === '' ||
            data.date ||
            data.date === '') {
            return false
        }
        return true
    }
}
