'use strict'
import { Router } from 'express'
import { test, addToCart, getPurchase, deleteProductCart } from './shoppingCar.controller.js'
import { validateJwt, isAdmin, isClient } from '../middlewares/validate_Jwt.js'

const api = Router()

api.get('/test', test)
api.post('/addToCart', [validateJwt, isClient], addToCart)
api.post('/getPurchase', [validateJwt, isClient], getPurchase)
api.delete('/deleteProductCart/:id', [validateJwt, isClient], deleteProductCart)

export default api