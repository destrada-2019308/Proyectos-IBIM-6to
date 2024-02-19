import { Router } from 'express'
import { saveCourse , updatedCourse, search, deleteCourse } from './course.controller.js'
import { validateJwt, isAdmin } from '../middlewares/validate_Jwt.js'

const api = Router()

api.post('/saveCourse', [validateJwt, isAdmin], saveCourse)
api.put('/updatedCourse/:id', [validateJwt, isAdmin], updatedCourse)
api.delete('/deleteCourse/:id', [validateJwt, isAdmin], deleteCourse)
api.post('/search', [validateJwt, isAdmin], search)

export default api