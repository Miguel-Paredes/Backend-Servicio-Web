// Importaciones
    // Importamos express
    import express from 'express'
    // Importamos cors
    import cors from 'cors'
    // Importamos dotenv
    import dotenv from 'dotenv'
    // Importamos routerProductos para manejar las solicitudes a la ruta /api/productos
    import routerProductos from './routers/router_productos.js'

// Inicializaciones
    // Creamos una variable que nos permita usar express
    const app = express()
    // Usamos dotenv para poder usar las variables del archivo .env
    dotenv.config()

// Configuraciones
    // Configuramos una variable dentro de app que almacena
    // el puerto en el cual se va a alzar el servidor
    app.set('port', process.env.port || 3000)
    // Habilitamos el middleware de CORS para permitir solicitudes de diferentes orígenes
    app.use(cors())

// Middlewares
    // Hacemos que el servidor use archivos json
    app.use(express.json())

// Rutas
    app.get('/', (req, res) => res.send('Bienvenido'))
    // Utilizamos routerProductos para manejar las solicitudes a la ruta /api/productos
    app.use('/api/productos', routerProductos)

    // Manejo de rutas en caso de que no sean encontradas
    app.use((req, res) => res.status(404).end())

// Exportamos express por medio de la variable app
export default app