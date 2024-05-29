// Importamos express
const express = require('express');
// Importamos los controladores
const {
    actualizarProducto,
    categoriaProducto,
    borrarProducto,
    buscarProducto,
    mostrarProductos,
    registrarProducto
} = require('../controllers/productos_controllers.js');
// Importamos la proteccion de rutas del administrador
const verificadoAdministrador = require('../helpers/permiso_admin.js');

// Importamos Router para crear el router de productos
const routerProductos = express.Router();

// Hacemos que el router use archivos json
routerProductos.use(express.json());

// Ruta para ver todos los productos
routerProductos.get('/productos/listar', mostrarProductos);

// Ruta para buscar un producto
routerProductos.get('/productos/buscar/:id', buscarProducto);

// Ruta para buscar productos por categoria
routerProductos.get('/productos/categoria/:id', categoriaProducto)

// Ruta para crear un nuevo producto
routerProductos.post('/productos/registro', verificadoAdministrador, registrarProducto);

// Ruta para actualizar un producto
routerProductos.put('/productos/actualizar/:id', verificadoAdministrador, actualizarProducto);

// Ruta para borrar un producto
routerProductos.delete('/productos/borrar/:id', verificadoAdministrador, borrarProducto);

// Manejo de rutas en caso de que no sean encontradas
routerProductos.use((req, res) => res.status(404).end());

// Exportamos routerProductos
module.exports = routerProductos;