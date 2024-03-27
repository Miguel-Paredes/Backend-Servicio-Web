// Importamos expres
const express = require('express');
// Importamos los controladores
const {
    mostrarFavoritos,
    buscarFavorito,
    registrarFavorito,
    borrarFavorito
} = require('../controllers/favoritos_controllers');


// Importamos Router para crear el router de favoritos
const routerFavoritos = express.Router();

// Hacemos que el router use archivos json
routerFavoritos.use(express.json());

// Ruta para ver todos los favoritos
routerFavoritos.get('/listar', mostrarFavoritos);

// Ruta para buscar un favoritos
routerFavoritos.get('/buscar/:id', buscarFavorito);

// Ruta para crear un nuevo favoritos
routerFavoritos.post('/registro', registrarFavorito);

// Ruta para borrar un favoritos
routerFavoritos.delete('/borrar/:id', borrarFavorito);

// Manejo de rutas en caso de que no sean encontradas
routerFavoritos.use((req, res) => res.status(404).end());

// Exportamos routerFavoritos
module.exports = routerFavoritos;