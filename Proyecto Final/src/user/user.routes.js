import { Router } from 'express'
import { test, registerClient, createUser, login} from './user.controller.js'
import { validateJwt, isAdmin, isStudent} from '../middlewares/validate_Jwt.js'

const api = Router()

api.get('/test', test)
api.post('/login', login)
api.post('/registerClient', registerClient)
api.post('/createUser', [validateJwt, isAdmin],createUser)

export default api