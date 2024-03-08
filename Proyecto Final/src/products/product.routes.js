'use stict'
import { Router } from 'express'
import { deleteProduct, getInventary, infoProducMasVendidos, productoOutOfStock, productosMasVendidos, saveProduct, search, searchName, showAll, test, updateProduct } from'./product.controller.js'
import { validateJwt, isAdmin, isClient} from '../middlewares/validate_Jwt.js'

const api = Router()

//Funciones del ADMIN 
api.get('/test', [validateJwt, isAdmin],test)
api.post('/saveProduct', [validateJwt, isAdmin],saveProduct)
api.get('/showAll', [validateJwt, isAdmin], showAll)
api.put('/updateProduct/:id', [validateJwt, isAdmin],updateProduct)
api.delete('/deleteProduct/:id', [validateJwt, isAdmin],deleteProduct)
api.post('/search', [validateJwt, isAdmin],search)
api.get('/infoProducMasVendidos', [validateJwt, isAdmin], infoProducMasVendidos)
api.get('/productoOutOfStock', [validateJwt, isAdmin], productoOutOfStock)
api.get('/getInventary', [validateJwt, isAdmin], getInventary)

//Funciones del CLIENT 
api.get('/productosMasVendidos', [validateJwt, isClient], productosMasVendidos)
api.get('/searchName', [validateJwt, isClient], searchName)
export default api