// Importamos express
const express = require('express');
const {
    mostrarPedidos,
    buscarPedido,
    registroPedido,
    listarProductosPedido,
    agregarProductoPedido,
    borrarProductoPedido,
    actualizarProductoPedido,
    eliminarPedido,
    verPedido
} = require('../controllers/pedidos_controllers');
// Importamos la autentificacion
const verificadoAutentication = require('../helpers/autenticacion');

// Importamos Router para crear el router de pedidos
const routerPedidos = express.Router();

// Hacemos que el router use archivos json
routerPedidos.use(express.json());

// Ruta para ver todos los pedidos realizados
routerPedidos.get('/:id', verificadoAutentication, verPedido)

// Ruta para ver todos los pedidos realizados
routerPedidos.post('/mostrar', verificadoAutentication, mostrarPedidos);

// Ruta para ver buscar un pedido realizado
routerPedidos.post('/buscar/:id', verificadoAutentication, buscarPedido);

// Ruta para registrar el pedido
routerPedidos.post('/registro', registroPedido);

// Ruta para ver todos los productos del pedido
routerPedidos.post('/listar', verificadoAutentication, listarProductosPedido);

// Ruta para agregar un producto al pedido
routerPedidos.post('/agregar', agregarProductoPedido);

// Ruta para borrar un producto del pedido
routerPedidos.post('/borrar/:id', verificadoAutentication, borrarProductoPedido);

// Ruta para actualizar algun producto del pedido
routerPedidos.post('/actualizar/:id', verificadoAutentication, actualizarProductoPedido);

// Ruta para eliminar todo el pedido
routerPedidos.post('/eliminar', verificadoAutentication, eliminarPedido);

// Exportamos routerPedidos
module.exports = routerPedidos