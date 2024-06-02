// Importamos express
const express = require('express');
const {
    agregarProductoVenta,
    actualizarProductoVenta,
    borrarProductoVenta,
    eliminarVenta,
    listarProductosVenta,
    mostrarVentas,
    buscarVenta,
    CajeroVenta,
    mostrarVentasAdministrador,
    buscarVentaAdministrador,
    verPedidosClientes,
    verPedidosEstadoClientes,
    PrepararPedidoCliente,
    EnviarPedidoCliente,
    PagadoPedidoCliente
} = require('../controllers/ventas_controllers.js');
// Importamos la autentificacion de los empleados
const verificadoEmpleados = require('../helpers/permiso_empleados');

// Importamos Router para crear el router de ventas
const routerVentas = express.Router();

// Hacemos que el router use archivos json
routerVentas.use(express.json());

// Ruta para que el administrador pueda ver todo las ventas
routerVentas.get('/ventas/admin/mostrar', verificadoEmpleados, mostrarVentasAdministrador)

// Ruta para que el administrador pueda buscar un pedido
routerVentas.get('/ventas/admin/mostrar/:id', verificadoEmpleados, buscarVentaAdministrador)

// Ruta para ver todos las ventas realizados
routerVentas.post('/ventas/mostrar', verificadoEmpleados, mostrarVentas);

// Ruta para ver buscar un pedido realizado
routerVentas.post('/ventas/buscar/:id', verificadoEmpleados, buscarVenta);

// Ruta para registrar el pedido
routerVentas.post('/ventas/registro', verificadoEmpleados, CajeroVenta);

// Ruta para ver todos los productos del pedido
routerVentas.post('/ventas/listar', verificadoEmpleados, listarProductosVenta);

// Ruta para agregar un producto al pedido
routerVentas.post('/ventas/agregar', verificadoEmpleados, agregarProductoVenta);

// Ruta para borrar un producto del pedido
routerVentas.post('/ventas/borrar/:id', verificadoEmpleados, borrarProductoVenta);

// Ruta para actualizar algun producto del pedido
routerVentas.post('/ventas/actualizar/:id', verificadoEmpleados, actualizarProductoVenta);

// Ruta para eliminar todo el pedido
routerVentas.post('/ventas/eliminar', verificadoEmpleados, eliminarVenta);

// Ruta para ver los pedidos de los clientes
routerVentas.post('/ventas/cliente', verificadoEmpleados, verPedidosClientes)

// Ruta para ver pedidos de los clientes segun su estado
routerVentas.post('/ventas/cliente/estado/:estado', verificadoEmpleados, verPedidosEstadoClientes)

// Ruta para ver el pedidos de cliente
routerVentas.post('/ventas/cliente/:pedido', verificadoEmpleados, PrepararPedidoCliente)

// Ruta para cambiar el estado del pedido
routerVentas.post('/ventas/cliente/enviado/:pedido', verificadoEmpleados, EnviarPedidoCliente)

// Ruta para ver el pedidos de cliente
routerVentas.post('/ventas/cliente/pagado/:pedido', verificadoEmpleados, PagadoPedidoCliente)

// Exportamos routerVentas
module.exports = routerVentas