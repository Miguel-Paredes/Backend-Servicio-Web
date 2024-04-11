// Importamos express
const express = require('express');

// Importamos Router para crear el router de pedidos
const routerPedidos = express.Router();

// Hacemos que el router use archivos json
routerPedidos.use(express.json());

// Ruta para ver todos los pedidos realizados
routerPedidos.post('/mostrar', (req, res) => res.json({ message : 'Mostrar todos los pedidos'}));

// Ruta para ver buscar un pedido realizado
routerPedidos.post('/buscar/:id', (req, res) => res.json({ message : 'Buscar un pedido'}));

// Ruta para registrar el pedido
routerPedidos.post('/registro', (req, res) => res.json({ message : 'Registrar el pedido'}));

// Ruta para ver todos los productos del pedido
routerPedidos.post('/listar', (req, res) => res.json({ message : 'Mostrar todos los productos del pedido'}));

// Ruta para agregar un producto al pedido
routerPedidos.post('/agregar', (req, res) => res.json({ message : 'Agregar producto'}));

// Ruta para borrar un producto del pedido
routerPedidos.post('/borrar/:id', (req, res) => res.json({ message : 'Borrar producto'}));

// Ruta para actualizar algun producto del pedido
routerPedidos.post('/actualizar/:id', (req, res) => res.json({ message : 'Actualizar producto'}));

// Ruta para eliminar todo el pedido
routerPedidos.post('/eliminar/:id', (req, res) => res.json({ message : 'Pedido eliminado'}));

// Exportamos routerPedidos
module.exports = routerPedidos