// Importamos expres
import express from 'express'
// Importamos los controladores
import {
    actualizarProducto,
    borrarProducto,
    buscarProducto,
    mostrarProductos,
    registrarProducto
} from '../controllers/productos_controllers.js'

// Importamos Router para crear el router de productos
const routerProductos = express.Router()

// Hacemos que el router use archivos json
routerProductos.use(express.json())

// Ruta para ver todos los productos
routerProductos.get('/listar', mostrarProductos)

// Ruta para buscar un producto
routerProductos.get('/buscar/:id', buscarProducto)

// Ruta para crear un nuevo producto
routerProductos.post('/registro', registrarProducto)

// Ruta para actualizar un producto
// routerProductos.put('/actualizar/:id', actualizarProducto)

// Ruta para borrar un producto
routerProductos.delete('/borrar/:id', borrarProducto)

// Manejo de rutas en caso de que no sean encontradas
routerProductos.use((req, res) => res.status(404).end())

// Exportamos routerProductos
export default routerProductos