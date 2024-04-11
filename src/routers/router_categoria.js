// Importamos express
const express = require('express');
// Importamos la proteccion de rutas del administrador
const { verificadoAdministrador } = require('../helpers/permiso_admin');
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
routerCategoria.get('/listar', mostrarCategorias);

// Ruta para buscar una categoria
routerCategoria.get('/buscar/:id', buscarCategoria);

// Ruta para ver agregar una categoria
routerCategoria.post('/registro', verificadoAdministrador, registrarCategoria);

// Ruta para ver actualizar una categoria
routerCategoria.put('/actualizar/:id', verificadoAdministrador, actualizarCategoria);

// Ruta para ver borrar una categoria
routerCategoria.delete('/borrar/:id', verificadoAdministrador, borrarCategoria);

// Manejo de rutas en caso de que no sean encontradas
routerCategoria.use((req, res) => res.status(404).end());

// Exportamos routerCategoria
module.exports = routerCategoria;