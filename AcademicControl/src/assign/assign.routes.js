import { Router } from 'express'
import { assingCourse, search } from './assign.controller.js'
import { validateJwt, isStudent } from '../middlewares/validate_Jwt.js'

const api = Router()

api.post('/assingCourse', [validateJwt, isStudent], assingCourse)
api.post('/search',  [validateJwt, isStudent], search)

export default api