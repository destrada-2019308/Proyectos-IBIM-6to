//Levantamos el serivdor http con express   
'use strict'

//Importaciones
import express from "express"
import morgan from "morgan"
import helmet from "helmet"
import cors from "cors"
import { config } from "dotenv"
import categoriesRoutes from "../src/categories/categories.routes.js"
import productsRoutes from '../src/products/product.routes.js'
import userRoutes from '../src/user/user.routes.js'
import shoppingCarRoutes from '../src/shoppingCar/shoppingCar.routes.js'

//Configuraciones
const app = express()
config()
const port = process.env.PORT || 3056

//Configuración del servidor
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

//Declaramos las rutas
app.use('/categories', categoriesRoutes)
app.use('/products', productsRoutes)
app.use('/user', userRoutes)
app.use('/shoppingCar', shoppingCarRoutes)

//Levantamos el sevidor
export const initServer = () => {
    app.listen(port)
    console.log(`Server HTTP running in port ${port}`)
} 