import { Router } from "express"
import { test, saveCategories, updateCategories, deleteCategories, search, get, categorysExists, productCategory } from './categories.controller.js'
import { validateJwt, isAdmin, isClient } from '../middlewares/validate_Jwt.js'

const api = Router()

api.get('/test', [validateJwt, isAdmin], test)
api.get('/get', [validateJwt, isAdmin], get)
api.post('/search', [validateJwt, isAdmin], search)
api.post('/saveCategories', [validateJwt, isAdmin], saveCategories)
api.put('/updateCategories/:id', [validateJwt, isAdmin], updateCategories)
api.delete('/deleteCategories/:id', [validateJwt, isAdmin], deleteCategories)

api.get('/categorysExists', [validateJwt, isClient], categorysExists)
api.post('/productCategory',  [validateJwt, isClient], productCategory)

export default api