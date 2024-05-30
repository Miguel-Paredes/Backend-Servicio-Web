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
    verVenta,
    mostrarVentasAdministrador,
    buscarVentaAdministrador
} = require('../controllers/ventas_controllers');
// Importamos la autentificacion de los empleados
const verificadoEmpleados = require('../helpers/permiso_empleados');

// Importamos Router para crear el router de ventas
const routerVentas = express.Router();

// Hacemos que el router use archivos json
routerVentas.use(express.json());

// Ruta para ver todos las ventas realizados
routerVentas.get('/ventas/:id', verificadoEmpleados, verVenta)

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

// Exportamos routerVentas
module.exports = routerVentas