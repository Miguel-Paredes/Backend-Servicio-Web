// Importamos express
const express = require('express');
// Importamos los controladores
const {
    inicioLogin,
    registroLogin,
    confirmEmail,
    recuperarPassword,
    comprobarTokenPasword,
    nuevoPassword,
    cierreSesionLogin,
    administrador
} = require('../controllers/login_controllers.js');

// Importamos la validacion de campos
const validacion = require('../middlewares/validacion.js');

// Importamos Router para crear el router de ingreso
const routerLogin = express.Router()

// Importamos el controlador del usuario del administrador
administrador()

// Hacemos que el router use archivos json
routerLogin.use(express.json())

// Ruta para iniciar sesion
routerLogin.post('/', inicioLogin)

// Ruta para registrar un nuevo usuario
routerLogin.post('/registro', validacion, registroLogin)

// Ruta para confirmar el correo
routerLogin.get('/confirmar/:token', confirmEmail)

// Ruta para recuperar contraseña
routerLogin.post('/recuperar-password', recuperarPassword)

// Ruta para recuperar la contraseña con token
routerLogin.get('/recuperar-password/:token', comprobarTokenPasword)

// Ruta para crear una nueva contraseña
routerLogin.post('/nuevo-password/:token', nuevoPassword)

// Ruta para cerrar la sesion
routerLogin.post('/cierre', cierreSesionLogin)

// Exportamos routerLogin
module.exports = routerLogin