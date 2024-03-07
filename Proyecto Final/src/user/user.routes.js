import { Router } from 'express'
import { test, registerClient, createUser, login, updateAdmin, updateClient, updateUserClient, deleteClient, deleteAdmin} from './user.controller.js'
import { validateJwt, isAdmin, isClient } from '../middlewares/validate_Jwt.js'

const api = Router()

api.get('/test', test)
api.post('/login', login)
api.post('/registerClient', registerClient)
api.post('/createUser', [validateJwt, isAdmin],createUser)
api.put('/updateAdmin/:id', [validateJwt, isAdmin], updateAdmin)
api.put('/updateClient/:id', [validateJwt, isAdmin], updateClient)
api.put('/updateUserClient/:id', [validateJwt, isClient], updateUserClient)
api.delete('/deleteClient/:id', [validateJwt, isClient], deleteClient)
api.delete('/deleteAdmin/:id', [validateJwt, isAdmin], deleteAdmin)

export default api