import { Router } from 'express'
import { test, register, login, registerTeacher, updateStudent, deleteA} from './user.controller.js'
import { validateJwt, isAdmin, isStudent} from '../middlewares/validate_Jwt.js'

const api = Router()

//Rutas públicas 
api.post('/register', register)
api.post('/login',login)

//Rutas privadas
api.get('/test', [validateJwt, isAdmin], test)
api.put('/registerTeacher/:id', [validateJwt, isAdmin ], registerTeacher)
api.put('/updateStudent/:id', [validateJwt, isStudent], updateStudent)
api.delete('/deleteA/:id', [validateJwt, isStudent], deleteA)
export default api
