'use strict'

import { Router } from "express"
import { test, register } from '../user/user.controller.js'

const api = Router()

api.get('/test', test)
api.post('/register', register)

export default api