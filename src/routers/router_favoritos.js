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
routerFavoritos.post('/favoritos/listar', verificadoAutentication, mostrarFavoritos);

// Ruta para buscar un favoritos
routerFavoritos.post('/favoritos/buscar/:id', verificadoAutentication, buscarFavorito);

// Ruta para buscat favoritos por categoria
routerFavoritos.post('/favoritos/categoria/:categoria', verificadoAutentication, categoriaFavorito);

// Ruta para crear un nuevo favoritos
routerFavoritos.post('/favoritos/registro', verificadoAutentication, registrarFavorito);

// Ruta para borrar un favoritos
routerFavoritos.post('/favoritos/borrar/:id', verificadoAutentication, borrarFavorito);

// Manejo de rutas en caso de que no sean encontradas
routerFavoritos.use((req, res) => res.status(404).end());

// Exportamos routerFavoritos
module.exports = routerFavoritos;