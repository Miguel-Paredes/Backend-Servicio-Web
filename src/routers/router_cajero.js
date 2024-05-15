// Importamos express
const express = require('express');
// Importamos la proteccion de rutas del administrador
const verificadoAdministrador = require('../helpers/permiso_admin');
// Importamos los controladores
const {
    crearCajero,
    actualizarCajero,
    borrarCajero,
    mostrarCajeros,
    buscarCajero
} = require('../controllers/cajero_controllers.js');

// Importamos la validacion de campos
const validacion = require('../middlewares/validacion.js');

// Importamos Router para crear el router de ingreso
const routerCajero = express.Router()

// Hacemos que el router use archivos json
routerCajero.use(express.json())

// Ruta para registrar un cajero
routerCajero.post('/registro', validacion, verificadoAdministrador, crearCajero )

// Ruta para actualizar un cajero
routerCajero.put('/actualizar', validacion, verificadoAdministrador, actualizarCajero)

// Ruta para borrar un cajero
routerCajero.delete('/eliminar', verificadoAdministrador, borrarCajero)

// Ruta para mostrar los cajeros
routerCajero.get('/mostrar', verificadoAdministrador, mostrarCajeros)

// Ruta para buscar un cajero
routerCajero.get('/buscar/:id', verificadoAdministrador, buscarCajero)

// Exportamos routerCajero
module.exports = routerCajero