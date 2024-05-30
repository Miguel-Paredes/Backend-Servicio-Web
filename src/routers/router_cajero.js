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
const validacionCajero = require('../middlewares/val_Cajero.js');

// Importamos Router para crear el router de ingreso
const routerCajero = express.Router()

// Hacemos que el router use archivos json
routerCajero.use(express.json())

// Ruta para registrar un cajero
routerCajero.post('/cajeros/registro', validacionCajero, verificadoAdministrador, crearCajero )

// Ruta para actualizar un cajero
routerCajero.put('/cajeros/actualizar', validacionCajero, verificadoAdministrador, actualizarCajero)

// Ruta para borrar un cajero
routerCajero.delete('/cajeros/eliminar', verificadoAdministrador, borrarCajero)

// Ruta para mostrar los cajeros
routerCajero.get('/cajeros/mostrar', verificadoAdministrador, mostrarCajeros)

// Ruta para buscar un cajero
routerCajero.get('/cajeros/buscar/:id', verificadoAdministrador, buscarCajero)

// Exportamos routerCajero
module.exports = routerCajero