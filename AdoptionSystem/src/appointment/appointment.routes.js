'use strict'

import { Router } from 'express'
import { save, test } from './appointment.controller.js'
import { validateJwt } from '../middlewares/validate_Jwt.js'

const api = Router()

//Rutas públicas 
api.get('/test', test)

//Rutas privadas - CLIENT
api.post('/save', [validateJwt], save)

export default api