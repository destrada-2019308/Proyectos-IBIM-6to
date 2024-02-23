import { Router } from "express"
import { test, saveCategories, updateCategories, deleteCategories, search, get } from './categories.controller.js'

const api = Router()

api.get('/test', test)
api.post('/saveCategories', saveCategories)
api.put('/updateCategories/:id', updateCategories)
api.delete('/deleteCategories/:id', deleteCategories)
api.post('/search', search)
api.get('/get', get)

export default api