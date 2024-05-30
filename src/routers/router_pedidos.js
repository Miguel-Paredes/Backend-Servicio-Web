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
    verPedido,
    buscarPedidoAdministrador,
    mostrarPedidosAdministrador
} = require('../controllers/pedidos_controllers');
// Importamos la autentificacion
const verificadoAutentication = require('../helpers/autenticacion');
// Importamos la autentificacion del administrador
const verificadoEmpleados = require('../helpers/permiso_empleados');

// Importamos Router para crear el router de pedidos
const routerPedidos = express.Router();

// Hacemos que el router use archivos json
routerPedidos.use(express.json());

// Ruta para ver todos los pedidos realizados
routerPedidos.get('/pedidos/:id', verificadoAutentication, verPedido)

// Ruta para que el administrador pueda ver todo los pedidos
routerPedidos.get('/pedidos/admin/mostrar', verificadoEmpleados, mostrarPedidosAdministrador)

// Ruta para que el administrador pueda buscar un pedido
routerPedidos.get('/pedidos/admin/mostrar/:id', verificadoEmpleados, buscarPedidoAdministrador)

// Ruta para ver todos los pedidos realizados
routerPedidos.post('/pedidos/mostrar', verificadoAutentication, mostrarPedidos);

// Ruta para ver buscar un pedido realizado
routerPedidos.post('/pedidos/buscar/:id', verificadoAutentication, buscarPedido);

// Ruta para registrar el pedido
routerPedidos.post('/pedidos/registro', verificadoAutentication, registroPedido);

// Ruta para ver todos los productos del pedido
routerPedidos.post('/pedidos/listar', verificadoAutentication, listarProductosPedido);

// Ruta para agregar un producto al pedido
routerPedidos.post('/pedidos/agregar', verificadoAutentication, agregarProductoPedido);

// Ruta para borrar un producto del pedido
routerPedidos.post('/pedidos/borrar/:id', verificadoAutentication, borrarProductoPedido);

// Ruta para actualizar algun producto del pedido
routerPedidos.post('/pedidos/actualizar/:id', verificadoAutentication, actualizarProductoPedido);

// Ruta para eliminar todo el pedido
routerPedidos.post('/pedidos/eliminar', verificadoAutentication, eliminarPedido);

// Exportamos routerPedidos
module.exports = routerPedidos