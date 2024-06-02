// Importamos express
const express = require('express');
// Importamos los controladores
const {
    mostrarFavoritos,
    buscarFavorito,
    registrarFavorito,
    borrarFavorito,
    categoriaFavorito
} = require('../controllers/favoritos_controllers');
// Importamos la autentificacion
const verificadoAutentication = require('../helpers/autenticacion');

// Importamos Router para crear el router de favoritos
const routerFavoritos = express.Router();

// Hacemos que el router use archivos json
routerFavoritos.use(express.json());

// Ruta para ver todos los favoritos
routerFavoritos.get('/favoritos/listar', verificadoAutentication, mostrarFavoritos);

// Ruta para buscar un favoritos
routerFavoritos.get('/favoritos/buscar/:id', verificadoAutentication, buscarFavorito);

// Ruta para buscat favoritos por categoria
routerFavoritos.get('/favoritos/categoria/:categoria', verificadoAutentication, categoriaFavorito);

// Ruta para crear un nuevo favoritos
routerFavoritos.post('/favoritos/registro', verificadoAutentication, registrarFavorito);

// Ruta para borrar un favoritos
routerFavoritos.delete('/favoritos/borrar/:id', verificadoAutentication, borrarFavorito);

// Exportamos routerFavoritos
module.exports = routerFavoritos;