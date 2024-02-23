'use stict'
import { Router } from 'express'
import { deleteProduct, saveProduct, search, showAll, test, updateProduct } from'./product.controller.js'

const api = Router()

api.get('/test', test)
api.post('/saveProduct', saveProduct)
api.get('/showAll', showAll)
api.put('/updateProduct/:id', updateProduct)
api.delete('/deleteProduct/:id', deleteProduct)
api.post('/search', search)

export default api