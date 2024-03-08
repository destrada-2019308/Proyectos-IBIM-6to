'use strict'

import { Router } from 'express'
import { test, completarCompra } from './bill.controller.js'
import { validateJwt, isAdmin, isClient } from '../middlewares/validate_Jwt.js'
import { deleteProductCart } from '../shoppingCar/shoppingCar.controller.js'

const api = Router()

api.get('/test', test)
api.post('/completarCompra', [validateJwt, isClient], completarCompra)
api.delete('/deleteProductCart', [validateJwt, isClient], deleteProductCart)

export default api