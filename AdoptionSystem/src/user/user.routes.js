import express from 'express'
import {test, register, login, update, deleteUser} from './user.controller.js'
import { validateJwt, isAdmin} from '../middlewares/validate_Jwt.js'

const api = express.Router()

//RUTAS PÚBLICAS
api.post('/register', register)
api.post('/login', login)

//RUTAS PRIVADAS (SOLO USUARIOS LOGGEADOS)
                //Middleware
api.get('/test', [validateJwt, isAdmin], test)
api.put('/update/:id', [validateJwt], update) //Middleware -> funciones intermedias que sirven para validar
api.delete('/delete/:id', [validateJwt], deleteUser)

export default api
