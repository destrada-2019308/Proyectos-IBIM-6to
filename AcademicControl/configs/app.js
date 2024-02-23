'use strict'

import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import { config } from 'dotenv'
import userRoutes from '../src/user/user.routes.js'
import courseRoutes from '../src/course/course.routes.js'
import assignRoutes from '../src/assign/assign.routes.js'

const app = express()
config()
const port = process.env.PORT || 3056

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

app.use('/user', userRoutes)
app.use('/course', courseRoutes)
app.use('/assign', assignRoutes)

export const initServer = () => {
    app.listen(port)
    console.log(`Server HTTP running in port ${port}`)
}
