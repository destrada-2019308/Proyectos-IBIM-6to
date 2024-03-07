'use strict'
import { Router } from 'express'
import { test, addToCart, purchase, getPurchase } from './shoppingCar.controller.js'
import { validateJwt, isAdmin, isClient } from '../middlewares/validate_Jwt.js'

const api = Router()

api.get('/test', test)
api.post('/getPurchase', getPurchase)
api.post('/addToCart', [validateJwt, isClient], addToCart)
api.put('/purchase/:id', [validateJwt, isClient], purchase)

export default api