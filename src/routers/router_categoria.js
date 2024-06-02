// Importamos express
const express = require('express');
// Importamos la proteccion de rutas del administrador
cons = require('../helpers/permiso_admin');
// Importamos los controladores
const {
    mostrarCategorias,
    buscarCategoria,
    registrarCategoria,
    actualizarCategoria,
    borrarCategoria
} = require('../controllers/categorias_controllers');

// Importamos Router para crear el router de productos
const routerCategoria = express.Router();

// Hacemos que el router use archivos json
routerCategoria.use(express.json());

// Ruta para mostrar todas las categorias
routerCategoria.get('/categoria/listar', mostrarCategorias);

// Ruta para buscar una categoria
routerCategoria.get('/categoria/buscar/:id', buscarCategoria);

// Ruta para ver agregar una categoria
routerCategoria.post('/categoria/registro', registrarCategoria);

// Ruta para ver actualizar una categoria
routerCategoria.put('/categoria/actualizar/:id', actualizarCategoria);

// Ruta para ver borrar una categoria
routerCategoria.delete('/categoria/borrar/:id', borrarCategoria);

// Exportamos routerCategoria
module.exports = routerCategoria;