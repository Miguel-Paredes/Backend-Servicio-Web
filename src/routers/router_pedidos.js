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
    eliminarPedido
} = require('../controllers/pedidos_controllers');

// Importamos Router para crear el router de pedidos
const routerPedidos = express.Router();

// Hacemos que el router use archivos json
routerPedidos.use(express.json());

// Ruta para ver todos los pedidos realizados
routerPedidos.post('/mostrar', mostrarPedidos);

// Ruta para ver buscar un pedido realizado
routerPedidos.post('/buscar/:id', buscarPedido);

// Ruta para registrar el pedido
routerPedidos.post('/registro', registroPedido);

// Ruta para ver todos los productos del pedido
routerPedidos.post('/listar', listarProductosPedido);

// Ruta para agregar un producto al pedido
routerPedidos.post('/agregar', agregarProductoPedido);

// Ruta para borrar un producto del pedido
routerPedidos.post('/borrar/:id', borrarProductoPedido);

// Ruta para actualizar algun producto del pedido
routerPedidos.post('/actualizar/:id', actualizarProductoPedido);

// Ruta para eliminar todo el pedido
routerPedidos.post('/eliminar', eliminarPedido);

// Exportamos routerPedidos
module.exports = routerPedidos