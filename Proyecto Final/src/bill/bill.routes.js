'use strict'

import { Router } from 'express'
import { test, completarCompra } from './bill.controller.js'
import { validateJwt, isAdmin, isClient } from '../middlewares/validate_Jwt.js'

const api = Router()

api.get('/test', test)
api.post('/completarCompra', [validateJwt, isClient], completarCompra)

export default api