// Importamos mongoose
const mongoose = require ('mongoose');

// Importamos el modelo Venta
const Venta = require('../models/ventas.js')

// Importamos el modelo Producto
const Producto = require ('../models/productos.js')

// Importamos el modelo Cajero
const Cajero = require ('../models/cajero.js')

// Importamos el modelo CarritoCajero
const CarritoCajero = require ('../models/carrito_cajeros.js');

// Importamos el modelo CarritoCajero
const Pedido = require ('../models/pedidos.js');

// Importamos sendMailToAdminToUpdateProduct
const { sendMailToAdminToUpdateProduct } = require('../config/nodemailer.js');

const agregarProductoVenta = async (req, res) => {
    // Desestructuramos el objeto req.body
    // Extraemos las propiedades cliente producto y cantidad en variables separadas 
    const { cliente, producto, cantidad } = req.body
    // Validar todos los campos llenos
    if (Object.values(req.body).includes('')) return res.status(400).json({ message : 'Lo sentimos, debes llenar todos los campos' })
    // Verificamos si se quiere ingresar una cantidad menor a 0
    if(cantidad < 0) return res.json({ message : 'No se puede ingresar una cantidad negativa'})
    // Verificamos si se quiere ingresar una cantidad mayor a 20
    else if(cantidad > 20) return res.json({ message : 'La cantidad maxima es de 20'})
    let productoAgregado = {}
    try{
        // Buscamos el producto en la base de datos
        const busProducto = await Producto.findById( producto )
        // Buscamos el cliente en la base de datos
        const busCliente = await Cajero.findById( cliente )
        // Almacenamos el nombre del producto
        const veriProducto = busProducto.nombre
        // Buscamos el producto del Venta en la base de datos
        const busProductoVenta = await CarritoCajero.findOne({producto : veriProducto})
        // En caso de que no se encuentre ese producto enviamos un mensaje
        if(!busProducto || busProducto.length === 0) return res.json({ message : 'No existe ese producto' })
        // En caso de que no se encuentre ese cliente enviamos un mensaje
        if(!busCliente || busCliente.length === 0) return res.json({ message : 'No existe ese Cajero' })
        // En caso de que se encuentre ese producto en el Venta enviamos un mensaje
        if(busProductoVenta) return res.json({ message : 'Ese producto ya esta en la Venta' })
        // Verificamos en stock que cantidad de producto tenemos
        if(cantidad > busProducto.cantidad) return res.json({ message : `Solo tenemos en stock ${busProducto.cantidad}`})
        // En caso de que no se hallan realizado Ventas agregamos el primer producto a un cliente
        const nuevoProductoVenta = new CarritoCajero({
            _id : new mongoose.Types.ObjectId,
            cliente : cliente,
            producto : busProducto.nombre,
            cantidad : cantidad,
            precio : busProducto.precio
        })
        // Guardamos en la base de datos
        await nuevoProductoVenta.save()
        // Mostramos al cliente la informacion pero el nombre del producto la primera es mayuscula y el resto minuscula
        productoAgregado = {
            'Producto' : busProducto.nombre.charAt(0).toUpperCase() + busProducto.nombre.slice(1).toLowerCase(),
            'Precio' : busProducto.precio,
            'Cantidad' : cantidad
        }
        // Restamos la cantidad del producto que el cajero va a adquirir
        const nuevaCantidad = busProducto.cantidad - cantidad
        // Actualizamos la cantidad en stock
        await Producto.findByIdAndUpdate( producto, { cantidad : nuevaCantidad }, { new : true} )
        if(nuevaCantidad == 0){
            res.json({ Stock : 'Indicar al Administrador que actualice la cantidad del producto', message : 'Producto agregado', Producto : productoAgregado })
            sendMailToAdminToUpdateProduct(busProducto.nombre)
        }else{
            // Mostramos el producto agregado
            res.json({ message : 'Producto agregado', Producto : productoAgregado})
        }
    }catch(err){
        // Enviamos un mensaje en caso de que no se pudo agregar el producto al Venta
        res.status(500).json({ message : 'Error al agregar el producto en la Venta' })
        // Mostramos el mensaje en consola
        console.log(err)
    }
}

const actualizarProductoVenta = async (req, res) => {
    // Desestructuramos el objeto req.body
    // Extraemos las propiedades cliente y cantidad en variables separadas 
    const cliente = req.body.cliente
    let cantidad = req.body.cantidad
    // Extraemos el id del producto de la url
    const producto = req.params.id
    // Validar todos los campos llenos
    if (Object.values(req.body).includes('')) return res.status(400).json({ message : 'Lo sentimos, debes llenar todos los campos' })
    // Verificamos si se quiere ingresar una cantidad menor a 0
    if(cantidad < 0) return res.json({ message : 'No se puede ingresar una cantidad negativa'})
    // Verificamos si se quiere ingresar una cantidad mayor a 20
    else if(cantidad > 20) return res.json({ message : 'La cantidad maxima es de 20'})
    try{
        // Buscamos el producto en la base de datos
        const busProducto = await Producto.findById( producto )
        // Buscamos el cliente en la base de datos
        const busCliente = await Cajero.findById( cliente )
        // Almacenamos el nombre del producto
        const veriProducto = busProducto.nombre
        // Buscamos el producto del Venta en la base de datos
        const busProductoVenta = await CarritoCajero.findOne({producto : veriProducto, cliente : cliente})
        cantidad -= busProductoVenta.cantidad
        // En caso de que no se encuentre ese producto enviamos un mensaje
        if(!busProducto || busProducto.length === 0) return res.json({ message : 'No existe ese producto' })
        // En caso de que no se encuentre ese cliente enviamos un mensaje
        if(!busCliente || busCliente.length === 0) return res.json({ message : 'No existe ese cliente' })
        // En caso de que no se encuentre ese producto en el Venta enviamos un mensaje
        if(!busProductoVenta || busProductoVenta.length === 0) return res.json({ message : 'No existe ese producto en la Venta' })
        // Verificamos en stock que cantidad de producto tenemos
        if(cantidad > busProducto.cantidad) return res.json({ message : `Solo tenemos en stock ${busProducto.cantidad+cantidad}`})
        cantidad += busProductoVenta.cantidad
        // Actualizamos el producto
        const productoVentaActualizado = await CarritoCajero.findByIdAndUpdate(
            busProductoVenta._id,
            {cantidad},
            { new : true}
        )
        cantidad = busProducto.cantidad - cantidad + busProductoVenta.cantidad
        // Actualizamos el stock
        await Producto.findByIdAndUpdate(producto, { cantidad : cantidad}, { new : true })
        // Guardamos los cambios en la base de datos
        await productoVentaActualizado.save()
        cantidad = productoVentaActualizado.cantidad
        // Mostramos al cliente la informacion pero el nombre del producto la primera es mayuscula y el resto minuscula
        productoActualizado = {
            'Producto' : busProducto.nombre.charAt(0).toUpperCase() + busProducto.nombre.slice(1).toLowerCase(),
            'Precio' : busProducto.precio,
            'Cantidad' : cantidad
        }
        res.json({ message : 'Producto Actualizado', Producto : productoActualizado });
    }catch(err){
        // Enviamos un mensaje en caso de que no se pudo actualizar el producto al Venta
        res.status(500).json({ message : 'Error al actualizar la cantidad del producto en la Venta' })
        // Mostramos el mensaje en consola
        console.log(err)
    }
}

const borrarProductoVenta = async (req, res) => {
    // Desestructuramos el objeto req.body
    // Extraemos las propiedades cliente en una variable
    const cliente = req.body.cliente
    // Extraemos el id del producto de la url
    const producto = req.params.id
    // Validar todos los campos llenos
    if (Object.values(req.body).includes('')) return res.status(400).json({ message : 'Lo sentimos, debes llenar todos los campos' })
    try{
        // Buscamos el producto en la base de datos
        const busProducto = await Producto.findById( producto )
        // Almacenamos el stock en una variable
        let stock = busProducto.cantidad
        // Buscamos el cliente en la base de datos
        const busCliente = await Cajero.findById( cliente )
        // Almacenamos el nombre del producto
        const veriProducto = busProducto.nombre
        // Buscamos el producto del Venta en la base de datos
        const busProductoVenta = await CarritoCajero.findOne({producto : veriProducto, cliente : cliente})
        // Almacenamos la cantidad del producto en una valriable
        const cantidad = busProductoVenta.cantidad 
        // En caso de que no se encuentre ese producto enviamos un mensaje
        if(!busProducto || busProducto.length === 0) return res.json({ message : 'No existe ese producto' })
        // En caso de que no se encuentre ese cliente enviamos un mensaje
        if(!busCliente || busCliente.length === 0) return res.json({ message : 'No existe ese Cajero' })
        // En caso de que no se encuentre ese producto en el Venta enviamos un mensaje
        if(!busProductoVenta || busProductoVenta.length === 0) return res.json({ message : 'No existe ese producto en la Venta' })
        // Sumamos al stock la cantidad del producto del carrito
        stock += cantidad
        // Actualizamos el stock de la tienda
        await Producto.findByIdAndUpdate( producto, { cantidad : stock }, { new : true } )
        // Buscamos el producto y lo eliminamos
        await CarritoCajero.findByIdAndDelete(busProductoVenta._id)
        // Enviamos un mensaje indicando que se borro el producto
        res.json({ message : 'Producto borrado de la Venta' })
    }catch(err){
        // Enviamos un mensaje en caso de que no se pudo borrar el producto al Venta
        res.status(500).json({ message : 'Error al borrar el producto de la Venta del Cajero' })
        // Mostramos el mensaje en consola
        console.log(err)
    }
}

const eliminarVenta = async (req, res) => {
    // Desestructuramos el objeto req.body
    // Extraemos las propiedades clientes en una variable
    const cliente = req.body.cliente
    // Validar todos los campos llenos
    if (Object.values(req.body).includes('')) return res.status(400).json({ message : 'Lo sentimos, debes llenar todos los campos' })
    try{
        // Buscamos el cliente en la base de datos
        const busCliente = await Cajero.findById( cliente )
        // Buscamos los producto del Venta en la base de datos
        const busProductoVenta = await CarritoCajero.find({ cliente : cliente})
        // En caso de que no se encuentre ese cliente enviamos un mensaje
        if(!busCliente || busCliente.length === 0) return res.json({ message : 'No existe ese Cajero' })
        // En caso de que no se encuentre ese cliente enviamos un mensaje
        if(!busProductoVenta || busProductoVenta.length === 0) return res.json({ message : 'Ese Cajero no se encuentra haciendo un Venta' })
        for(i = 0 ; i < busProductoVenta.length ; i++){
            const nombre = busProductoVenta[i].producto
            const product = await Producto.findOne({ nombre : nombre})
            const id = product.id
            let stock = product.cantidad
            const cantidad = busProductoVenta[i].cantidad
            stock += cantidad
            await Producto.findByIdAndUpdate(id, { cantidad : stock }, { new : true})
            await CarritoCajero.findByIdAndDelete(busProductoVenta[i]._id)
        }
        res.json({ message : 'Venta eliminado' })
    }catch(err){
        // Enviamos un mensaje en caso de que no se pudo borrar el Venta
        res.status(500).json({ message : 'Error al borrar todo la Venta del Cajero' })
        // Mostramos el mensaje en consola
        console.log(err)
    }
}

const listarProductosVenta = async (req, res) => {
    // Desestructuramos el objeto req.body
    // Extraemos las propiedades clientes en una variable
    const cliente = req.query.cliente
    // Creamos una variable para calcular el total del Venta
    let total = 0
    // Validar todos los campos llenos
    if (Object.values(req.body).includes('')) return res.status(400).json({ message : 'Lo sentimos, debes llenar todos los campos' })
    try{
        // Buscamos el cliente en la base de datos
        const busCliente = await Cajero.findById( cliente )
        // Buscamos los producto del Venta en la base de datos
        const busProductoVenta = await CarritoCajero.find({ cliente : cliente})
        // En caso de que no se encuentre ese cliente enviamos un mensaje
        if(!busCliente || busCliente.length === 0) return res.json({ message : 'No existe ese Cajero' })
        // En caso de que no se encuentre ese cliente enviamos un mensaje
        if(!busProductoVenta || busProductoVenta.length === 0) return res.json({ message : 'Ese Cajero no se encuentra haciendo un Venta' })
        let mostrar = {}
        mostrar[busCliente._id] = []
        for (i = 0 ; i < busProductoVenta.length ; i++){
            const nombreProducto = busProductoVenta[i].producto.charAt(0).toUpperCase() + busProductoVenta[i].producto.slice(1).toLowerCase();
            mostrar[busCliente._id].push({
                'Producto' : nombreProducto,
                'Cantidad' : busProductoVenta[i].cantidad,
                'Precio' : busProductoVenta[i].precio
            })
            // Sacamos el precio del producto
            const precio = busProductoVenta[i].precio
            // Sacamos la cantidad del producto
            const cantidad = busProductoVenta[i].cantidad
            // Calculamos el valor
            const subtotal = precio*cantidad
            // Almacenamos en total
            total += subtotal
        }
        // Mostramos el total
        mostrar[busCliente._id].push({
            'Total' : total
        })
        // Mostramos todo el Venta
        res.json({ Venta : mostrar})
    }catch(err){
        // Enviamos un mensaje en caso de que no se pudo mostrar el Venta
        res.status(500).json({ message : 'Error al mostrar todo la Venta del Cajero' })
        // Mostramos el mensaje en consola
        console.log(err)
    }
}

const mostrarVentas = async (req, res) => {
    // Desestructuramos el objeto req.body
    // Extraemos las propiedades cliente en una variable
    const cliente = req.query.cliente
    // Validar todos los campos llenos
    if (Object.values(req.body).includes('')) return res.status(400).json({ message : 'Lo sentimos, debes llenar todos los campos' })
    try{
        // Buscamos el cliente en la base de datos
        const busCliente = await Cajero.findById( cliente )
        // En caso de que no se encuentre ese cliente enviamos un mensaje
        if(!busCliente || busCliente.length === 0) return res.json({ message : 'No existe ese Cajero' })
        // Buscamos en la base de datos todos los Ventas del cliente
        const Ventas = await Venta.find({ cliente : cliente })
        // En caso de que no existan Ventas realizados previamente
        if (!Ventas || Ventas.length === 0) return res.json({ message : 'No existen Ventas realizados previamente' });
        // Convertimos la primera letra en mayuscula y el resto en minuscula de los nombres de los productos
        const listarVentas = Ventas.map(Venta => {
            const productosFormateados = Venta.producto.map(producto => {
              const nombreProducto = producto.charAt(0).toUpperCase() + producto.slice(1).toLowerCase();
              return nombreProducto;
            });
            return { ...Venta.toObject(), producto: productosFormateados };
          });
        // Mostramos todos los Ventas del cliente
        res.status(200).json(listarVentas);
    }catch(err){
        // Enviamos un mensaje en caso de que no se pudo mostrar el Venta
        res.status(500).json({ message : 'Error al mostrar las Ventas del Cajero' })
        // Mostramos el mensaje en consola
        console.log(err)
    }
}

const buscarVenta = async (req, res) => {
    // Desestructuramos el objeto req.body
    // Extraemos las propiedades cliente en una variable
    const cliente = req.query.cliente
    // Extraemos la id de la url
    const VentaId = req.params.id
    // Validar todos los campos llenos
    if (Object.values(req.body).includes('')) return res.status(400).json({ message : 'Lo sentimos, debes llenar todos los campos' })
    try{
        // Buscamos el cliente en la base de datos
        const busCliente = await Cajero.findById( cliente )
        // En caso de que no se encuentre ese cliente enviamos un mensaje
        if(!busCliente || busCliente.length === 0) return res.json({ message : 'No existe ese Cajero' })
        // Buscamos en la base de datos todos los Ventas del cliente
        const Ventas = await Venta.find({ _id : VentaId})
        // En caso de que no exista ese Favorito enviamos un mensaje
        if (!Ventas || Ventas.length === 0) return res.json({ message : 'No existe esa Venta del Cajero' });
        // Convertimos la primera letra en mayuscula y el resto en minuscula de los nombres de los productos
        const listarVentas = Ventas.map(Venta => {
            const productosFormateados = Venta.producto.map(producto => {
                const nombreProducto = producto.charAt(0).toUpperCase() + producto.slice(1).toLowerCase();
                return nombreProducto;
            });
            return { ...Venta.toObject(), producto: productosFormateados };
        });
        // Mostramos todos los Ventas del cliente
        res.status(200).json(listarVentas);
    }catch(err){
        // Enviamos un mensaje en caso de que no se pudo buscar el Venta
        res.status(500).json({ message : 'Error al buscar la Venta del Cajero' })
        // Mostramos el mensaje en consola
        console.log(err)
    }
}

const CajeroVenta = async (req, res) => {
    // Desestructuramos el objeto req.body
    // Extraemos la propiedad cliente en una variable
    const cliente = req.body.cliente
    // Validar todos los campos llenos
    if (Object.values(req.body).includes('')) return res.status(400).json({ message : 'Lo sentimos, debes llenar todos los campos' })
    // Creamos variables temporales que nos serviran para poder hacer calculos
    let total = 0
    try{
        // Buscamos el cliente en la base de datos
        const busCliente = await Cajero.findById( cliente )
        // Buscamos los productos del Venta en la base de datos
        const busProductoVenta = await CarritoCajero.find({ cliente : cliente})
        // En caso de que no se encuentre ese cliente enviamos un mensaje
        if(!busCliente || busCliente.length === 0) return res.json({ message : 'No existe ese Cajero' })
        // En caso de que no se encuentre ese producto en el Venta enviamos un mensaje
        if(!busProductoVenta || busProductoVenta.length === 0) return res.json({ message : 'Ese Cajero no se encuentra haciendo un Venta' })
        // Almacenamos el nombre del cajero en una variable
        const nombreCajero = busCliente.username
        // Creamos una nueva instancia 
        const nuevoVenta = new Venta({
            _id : new mongoose.Types.ObjectId,
            cliente : cliente,
            cajero : nombreCajero,
            producto : [],
            cantidad : [],
            precio : [],
            total : total
        })
        let mostrar = {}
        mostrar[busCliente._id] = []
        mostrar[busCliente._id].push({
            'Producto' : [],
            'Cantidad' : [],
            'Precio' : []
        })
        // Recorremos los datos de la coleccion y agregas los valores a los campos de tipo array
        for (i = 0 ; i < busProductoVenta.length ; i++){
            // Almacenamos la informacion de producto cantidad precio
            const producto = busProductoVenta[i].producto;
            const cantidad = busProductoVenta[i].cantidad;
            const precio = busProductoVenta[i].precio;
            // Calculamos el precio del total del Venta
            const subtotal = precio*cantidad
            // Lo vamos almacenando
            total += subtotal
            // Subimos la informacion de producto cantidad precio al array
            nuevoVenta.producto.push(producto);
            nuevoVenta.cantidad.push(cantidad);
            nuevoVenta.precio.push(precio);
            const nombreProducto = busProductoVenta[i].producto.charAt(0).toUpperCase() + busProductoVenta[i].producto.slice(1).toLowerCase();
            mostrar[busCliente._id][0].Producto.push(nombreProducto)
            mostrar[busCliente._id][0].Cantidad.push(cantidad)
            mostrar[busCliente._id][0].Precio.push(precio)
            // Vamos eliminando cada producto de la coleccion CarritoCajero
            await CarritoCajero.findByIdAndDelete(busProductoVenta[i]._id)
        }
        mostrar[busCliente._id].push({
            'Total' : total,
            'Fecha' : nuevoVenta.fecha
        })
        // Guardamos el total del Venta
        nuevoVenta.total = total;
        // Guardamos en la base de datos
        await nuevoVenta.save()
        // Enviamos un mensaje
        res.json({ message : 'Venta realizado con exito', Venta : mostrar })
    }catch(err){
        // Enviamos un mensaje en caso de que no se pudo guardar el Venta
        res.status(500).json({ message : 'Error al guardar la Venta del Cajero' })
        // Mostramos el mensaje en consola
        console.log(err)
    }
}

const mostrarVentasAdministrador = async (req, res) => {
    try {
        // Buscamos los Ventas en la bdd
        const Ventas = await Venta.find()
        // En caso de que no existan Ventas enviamos un mensaje
        if(!Ventas || Ventas.length === 0) return res.json({ message : 'No existen Ventas'})
        // Mostramos los Ventas
        res.json(Ventas)
    } catch(err){
        // Enviamos un mensaje en caso de que no se pudo mostrar todos los Ventas
        res.json({ message : 'Error al mostrar todas las Ventas'})
        // Mostramos los errores
        console.log(err)
    }
}

const buscarVentaAdministrador = async (req, res) => {
    // Desestructuramos el objeto req.body
    // Extraemos las propiedades telefono y fecha en variables separadas
    const { telefono, fecha } = req.body
    // Declaramos el inicio y el fin de las fechas
    const inicio = new Date(fecha)
    const fin = new Date(fecha)
    // Configurar la hora para indicar el final del día 
    fin.setUTCHours(23, 59, 59, 999); 
    try {
        // Buscamos los Ventas en la bdd
        let cliente = await Cajero.findOne({ telefono : telefono })
        cliente = cliente.id
        // En caso de que no existan Ventas enviamos un mensaje
        if(!cliente || cliente.length === 0) return res.json({ message : 'No ese Cajero'})
        const Ventas = await Venta.find({
            cliente : cliente,
            fecha : {
                $gte : inicio,
                $lt : fin
            }
        })
        // Mostramos los Ventas
        res.json(Ventas)
    } catch(err){
        // Enviamos un mensaje en caso de que no se pudo mostrar todos los Ventas
        res.json({ message : 'Error al mostrar todos los Ventas'})
        // Mostramos los errores
        console.log(err)
    }
}

const verPedidosClientes = async (req, res) => {
    try{
        // Visualizar todos los pedidos
        const visualizar = await Pedido.find()
        // Si no existen pedidos enviamos un mensaje
        if(visualizar.length === 0 || !visualizar) return res.json({ message : 'No existen pedidos' })
        // Mostramos todos los pedidos
        res.json(visualizar)
    }catch(err){
        // Enviamos un mensaje en caso de que no se pudo mostrar todos los Ventas
        res.json({ message : 'Error al mostrar todos los Pedidos'})
        // Mostramos los errores
        console.log(err)
    }
}

const verPedidosEstadoClientes = async (req, res) => {
    // Extraemos el estado de la url
    const estado = req.params.estado
    try{
        // Visualizar todos los pedidos
        const visualizar = await Pedido.find({ estado : estado})
        // Si no existen pedidos enviamos un mensaje
        if(visualizar.length === 0 || !visualizar) return res.json({ message : 'No existen pedidos en ese estado' })
        // Mostramos todos los pedidos
        res.json(visualizar)
    }catch(err){
        // Enviamos un mensaje en caso de que no se pudo mostrar todos los Ventas
        res.json({ message : 'Error al mostrar los Pedidos segun el estado'})
        // Mostramos los errores
        console.log(err)
    }
}

const PrepararPedidoCliente = async (req, res) => {
    // Extraemos el pedido de la url
    const pedido = req.params.pedido
    try {
        // Visualizar todos los pedidos
        let visualizar = await Pedido.find({ id : pedido})
        // Si no existen pedidos enviamos un mensaje
        if(visualizar.length === 0 || !visualizar) return res.json({ message : 'No existe ese pedido' })
        // Si el estado del pedido es en espera se actualiza a en preparacion
        if(visualizar[0].estado == 'En espera'){
            // Actualizamos el estado del pedido
            visualizar = await Pedido.findByIdAndUpdate(pedido, { estado : 'En preparación'}, { new : true })
        }
        // Mostramos todos los pedidos
        res.json(visualizar)
    }catch(err){
        // Enviamos un mensaje en caso de que no se pudo mostrar todos los Ventas
        res.json({ message : 'Error al mostrar los Pedidos segun el estado'})
        // Mostramos los errores
        console.log(err)
    }
}

const EnviarPedidoCliente = async (req, res) => {
    // Extraemos el pedido de la url
    const pedido = req.params.pedido
    try {
        // Visualizar todos los pedidos
        let visualizar = await Pedido.find({ id : pedido})
        // Si no existen pedidos enviamos un mensaje
        if(visualizar.length === 0 || !visualizar) return res.json({ message : 'No existe ese pedido' })
        // Si el estado del pedido es en preparacion se actualiza a enviado
        if(visualizar[0].estado == 'En preparación'){
            // Actualizamos el estado del pedido
            visualizar = await Pedido.findByIdAndUpdate(pedido, { estado : 'Enviado'}, { new : true })
        }
        // Mostramos todos los pedidos
        res.json(visualizar)
    }catch(err){
        // Enviamos un mensaje en caso de que no se pudo mostrar todos los Ventas
        res.json({ message : 'Error al mostrar los Pedidos segun el estado'})
        // Mostramos los errores
        console.log(err)
    }
}   

const PagadoPedidoCliente = async (req, res) => {
    // Extraemos el pedido de la url
    const pedido = req.params.pedido
    try {
        // Visualizar todos los pedidos
        let visualizar = await Pedido.find({ id : pedido})
        // Si no existen pedidos enviamos un mensaje
        if(visualizar.length === 0 || !visualizar) return res.json({ message : 'No existe ese pedido' })
        // Si el estado del pedido es ennviado se actualiza a pagado
        if(visualizar[0].estado == 'Enviado'){
            // Actualizamos el estado del pedido
            visualizar = await Pedido.findByIdAndUpdate(pedido, { estado : 'Pagado'}, { new : true })
        }
        // Mostramos todos los pedidos
        res.json(visualizar)
    }catch(err){
        // Enviamos un mensaje en caso de que no se pudo mostrar todos los Ventas
        res.json({ message : 'Error al mostrar los Pedidos segun el estado'})
        // Mostramos los errores
        console.log(err)
    }
}  

module.exports = {
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
}