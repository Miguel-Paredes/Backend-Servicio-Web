// Importaciones
    // Importamos express
    const express = require('express')
    // Importamos cors
    const cors = require('cors')
    // Importamos dotenv
    const dotenv = require('dotenv')
    // Importacion de fileUpload
    const fileUpload = require('express-fileupload')
    // Importamos routerProductos para manejar las solicitudes a la ruta /api/productos
    const routerProductos = require('./routers/router_productos.js')
    // Importamos routerFavoritos para manejar las solicitudes a la ruta /api/favoritos
    const routerFavoritos = require('./routers/router_favoritos.js')
    // Importamos routerLogin para manejar las solicitudes a la ruta /api/login
    const routerLogin = require('./routers/router_login.js')
    // Importamos routerCategoria para manejar las solicitudes a la ruta /api/categoria
    const routerCategoria = require('./routers/router_categoria.js')
    // Importamos routerPedidos para manejar las solicitudes a la ruta /api/pedidos
    const routerPedidos = require('./routers/router_pedidos.js')
    // Importamos routerCajero para manejar las solicitudes a la ruta /api/cajeros
    const routerCajero = require('./routers/router_cajero.js')
    // Importamos routerVentas para manejar las solicitudes a la ruta /api/ventas
    const routerVentas = require('./routers/router_ventas.js')

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
    // Establecer la carpeta temporal y el directorio
    app.use(fileUpload({
        useTempFiles : true,
        tempFileDir : './uploads'
    }));

// Middlewares
    // Hacemos que el servidor use archivos json
    app.use(express.json())

// Rutas
    // Utilizamos routerProductos para manejar las solicitudes a la ruta /api/productos
    app.use('/api', routerProductos)
    // Utilizamos routerFavoritos para manejar las solicitudes a la ruta /api/favoritos
    app.use('/api', routerFavoritos)
    // Utilizamos routerLogin para manejar las solicitudes a la ruta /api/login
    app.use('/api', routerLogin)
    // Utilizamos routerCategoria para manejar las solicitudes a la ruta /api/categoria
    app.use('/api', routerCategoria)
    // Utilizamos routerPedidos para manejar las solicitudes a la ruta /api/pedidos
    app.use('/api', routerPedidos)
    // Utilizamos routerCajero para manejar las solicitudes a la ruta /api/cajeros
    app.use('/api', routerCajero)
    // Utilizamos routerVentas para manejar las solicitudes a la ruta /api/ventas
    app.use('/api', routerVentas)

    // Manejo de rutas en caso de que no sean encontradas
    app.use((req, res) => res.status(404).end())

// Exportamos express por medio de la variable app
module.exports = app