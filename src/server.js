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

// Inicializaciones
    // Creamos una variable que nos permita usar express
    const app = express()
    // Usamos dotenv para poder usar las variables del archivo .env
    dotenv.config()

// Configuraciones
    // const upload = multer({ dest : 'uploads'})
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
    app.use('/api/productos', routerProductos)
    // Utilizamos routerFavoritos para manejar las solicitudes a la ruta /api/favoritos
    app.use('/api/favoritos', routerFavoritos)

    // Manejo de rutas en caso de que no sean encontradas
    app.use((req, res) => res.status(404).end())

// Exportamos express por medio de la variable app
module.exports = app