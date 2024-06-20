// Importamos mongoose
const mongoose = require ('mongoose');

// Importamos el modelo Pedido
const Pedido = require('../models/pedidos.js')

// Importamos el modelo Producto
const Producto = require ('../models/productos.js')

// Importamos el modelo Registro
const Registro = require ('../models/login.js')

// Importamos el modelo Carrito
const Carrito = require ('../models/carrito.js');

// Importamos sendMailToConfirmBuyOfUser, sendMailToAdmin, sendMailToAdminToUpdateProduct
const { sendMailToConfirmBuyOfUser, sendMailToAdminToUpdateProduct } = require('../config/nodemailer.js');


const agregarProductoPedido = async (req, res) => {
    // Desestructuramos el objeto req.body
    // Extraemos las propiedades cliente producto y cantidad en variables separadas 
    const { cliente, producto, cantidad } = req.body
    // Validar todos los campos llenos
    if (Object.values(req.body).includes('')) return res.status(400).json({ message: 'Lo sentimos, debes llenar todos los campos' })
    // Verificamos si se quiere ingresar una cantidad menor a 0
    if(cantidad < 0) return res.json({ message : 'No se puede ingresar una cantidad negativa'})
    // Verificamos si se quiere ingresar una cantidad mayor a 20
    else if(cantidad > 20) return res.json({ message : 'La cantidad maxima es de 20'})
    let productoAgregado = {}
    try{
        // Buscamos el producto en la base de datos
        const busProducto = await Producto.findById( producto )
        // Buscamos el cliente en la base de datos
        const busCliente = await Registro.findById( cliente )
        // Almacenamos el nombre del producto
        const veriProducto = busProducto.nombre
        // Buscamos el producto del pedido en la base de datos
        const busProductoPedido = await Carrito.findOne({producto : veriProducto})
        // En caso de que no se encuentre ese producto enviamos un mensaje
        if(!busProducto || busProducto.length === 0) return res.json({ message : 'No existe ese producto' })
        // En caso de que no se encuentre ese cliente enviamos un mensaje
        if(!busCliente || busCliente.length === 0) return res.json({ message : 'No existe ese cliente' })
        // En caso de que se encuentre ese producto en el pedido enviamos un mensaje
        if(busProductoPedido) return res.json({ message : 'Ese producto ya esta en el pedido' })
        // Verificamos en stock que cantidad de producto tenemos
        if(cantidad > busProducto.cantidad) return res.json({ message : `Solo tenemos en stock ${busProducto.cantidad}`})
        // En caso de que no se hallan realizado pedidos agregamos el primer producto a un cliente
        const nuevoProductoPedido = new Carrito({
            _id : new mongoose.Types.ObjectId,
            cliente : cliente,
            producto : busProducto.nombre,
            cantidad : cantidad,
            precio : busProducto.precio
        })
        // Guardamos en la base de datos
        await nuevoProductoPedido.save()
        // Mostramos al cliente la informacion pero el nombre del producto la primera es mayuscula y el resto minuscula
        productoAgregado = {
            'Producto' : busProducto.nombre.charAt(0).toUpperCase() + busProducto.nombre.slice(1).toLowerCase(),
            'Precio' : busProducto.precio,
            'Cantidad' : cantidad
        }
        // Restamos la cantidad del producto que el cliente va a adquirir
        const nuevaCantidad = busProducto.cantidad - cantidad
        // Actualizamos la cantidad en stock
        await Producto.findByIdAndUpdate( producto, { cantidad : nuevaCantidad }, { new : true} )
        if(nuevaCantidad == 0){
            sendMailToAdminToUpdateProduct(busProducto.nombre)
        }
        // Mostramos el producto agregado
        res.json({ message : 'Producto agregado', Producto : productoAgregado})
    }catch(err){
        // Enviamos un mensaje en caso de que no se pudo agregar el producto al pedido
        res.status(500).json({ message : 'Error al agregar el producto al pedido' })
        // Mostramos el mensaje en consola
        console.log(err)
    }
}

const actualizarProductoPedido = async (req, res) => {
    // Desestructuramos el objeto req.body
    // Extraemos las propiedades cliente y cantidad en variables separadas 
    const cliente = req.body.cliente
    let cantidad = req.body.cantidad
    // Extraemos el id del producto de la url
    const producto = req.params.id
    // Validar todos los campos llenos
    if (Object.values(req.body).includes('')) return res.status(400).json({ message: 'Lo sentimos, debes llenar todos los campos' })
    // Verificamos si se quiere ingresar una cantidad menor a 0
    if(cantidad < 0) return res.json({ message : 'No se puede ingresar una cantidad negativa'})
    // Verificamos si se quiere ingresar una cantidad mayor a 20
    else if(cantidad > 20) return res.json({ message : 'La cantidad maxima es de 20'})
    try{
        // Buscamos el producto en la base de datos
        const busProducto = await Producto.findById( producto )
        // Buscamos el cliente en la base de datos
        const busCliente = await Registro.findById( cliente )
        // Almacenamos el nombre del producto
        const veriProducto = busProducto.nombre
        // Buscamos el producto del pedido en la base de datos
        const busProductoPedido = await Carrito.findOne({producto : veriProducto, cliente : cliente})
        cantidad -= busProductoPedido.cantidad
        // En caso de que no se encuentre ese producto enviamos un mensaje
        if(!busProducto || busProducto.length === 0) return res.json({ message : 'No existe ese producto' })
        // En caso de que no se encuentre ese cliente enviamos un mensaje
        if(!busCliente || busCliente.length === 0) return res.json({ message : 'No existe ese cliente' })
        // En caso de que no se encuentre ese producto en el pedido enviamos un mensaje
        if(!busProductoPedido || busProductoPedido.length === 0) return res.json({ message : 'No existe ese producto en el pedido' })
        // Verificamos en stock que cantidad de producto tenemos
        if(cantidad > busProducto.cantidad) return res.json({ message : `Solo tenemos en stock ${busProducto.cantidad+cantidad}`})
        cantidad += busProductoPedido.cantidad
        // Actualizamos el producto
        const productoPedidoActualizado = await Carrito.findByIdAndUpdate(
            busProductoPedido._id,
            {cantidad},
            { new : true}
        )
        cantidad = busProducto.cantidad - cantidad + busProductoPedido.cantidad
        // Actualizamos el stock
        await Producto.findByIdAndUpdate(producto, { cantidad : cantidad}, { new : true })
        // Guardamos los cambios en la base de datos
        await productoPedidoActualizado.save()
        cantidad = productoPedidoActualizado.cantidad
        // Mostramos al cliente la informacion pero el nombre del producto la primera es mayuscula y el resto minuscula
        productoActualizado = {
            'Producto' : busProducto.nombre.charAt(0).toUpperCase() + busProducto.nombre.slice(1).toLowerCase(),
            'Precio' : busProducto.precio,
            'Cantidad' : cantidad
        }
        res.json({ message: 'Producto Actualizado', Producto : productoActualizado });
    }catch(err){
        // Enviamos un mensaje en caso de que no se pudo actualizar el producto al pedido
        res.status(500).json({ message : 'Error al actualizar la cantidad del producto en el pedido' })
        // Mostramos el mensaje en consola
        console.log(err)
    }
}

const borrarProductoPedido = async (req, res) => {
    // Desestructuramos el objeto req.body
    // Extraemos las propiedades cliente en una variable
    const cliente = req.body.cliente
    // Extraemos el id del producto de la url
    const producto = req.params.id
    // Validar todos los campos llenos
    if (Object.values(req.body).includes('')) return res.status(400).json({ message: 'Lo sentimos, debes llenar todos los campos' })
    try{
        // Buscamos el producto en la base de datos
        const busProducto = await Producto.findById( producto )
        // Almacenamos el stock en una variable
        let stock = busProducto.cantidad
        // Buscamos el cliente en la base de datos
        const busCliente = await Registro.findById( cliente )
        // Almacenamos el nombre del producto
        const veriProducto = busProducto.nombre
        // Buscamos el producto del pedido en la base de datos
        const busProductoPedido = await Carrito.findOne({producto : veriProducto, cliente : cliente})
        // Almacenamos la cantidad del producto en una valriable
        const cantidad = busProductoPedido.cantidad
        // En caso de que no se encuentre ese producto enviamos un mensaje
        if(!busProducto || busProducto.length === 0) return res.json({ message : 'No existe ese producto' })
        // En caso de que no se encuentre ese cliente enviamos un mensaje
        if(!busCliente || busCliente.length === 0) return res.json({ message : 'No existe ese cliente' })
        // En caso de que no se encuentre ese producto en el pedido enviamos un mensaje
        if(!busProductoPedido || busProductoPedido.length === 0) return res.json({ message : 'No existe ese producto en el pedido' })
        // Sumamos al stock la cantidad del producto del carrito
        stock += cantidad
        // Actualizamos el stock de la tienda
        await Producto.findByIdAndUpdate( producto, { cantidad : stock }, { new : true } )
        // Buscamos el producto y lo eliminamos
        await Carrito.findByIdAndDelete(busProductoPedido._id)
        // Enviamos un mensaje indicando que se borro el producto
        res.json({ message : 'Producto borrado del pedido' })
    }catch(err){
        // Enviamos un mensaje en caso de que no se pudo borrar el producto al pedido
        res.status(500).json({ message : 'Error al borrar el producto del pedido del cliente' })
        // Mostramos el mensaje en consola
        console.log(err)
    }
}

const eliminarPedido = async (req, res) => {
    // Desestructuramos el objeto req.body
    // Extraemos las propiedades clientes en una variable
    const cliente = req.body.cliente
    // Validar todos los campos llenos
    if (Object.values(req.body).includes('')) return res.status(400).json({ message: 'Lo sentimos, debes llenar todos los campos' })
    try{
        // Buscamos el cliente en la base de datos
        const busCliente = await Registro.findById( cliente )
        // Buscamos los producto del pedido en la base de datos
        const busProductoPedido = await Carrito.find({ cliente : cliente})
        // En caso de que no se encuentre ese cliente enviamos un mensaje
        if(!busCliente || busCliente.length === 0) return res.json({ message : 'No existe ese cliente' })
        // En caso de que no se encuentre ese cliente enviamos un mensaje
        if(!busProductoPedido || busProductoPedido.length === 0) return res.json({ message : 'Ese cliente no se encuentra haciendo un pedido' })
        for(i = 0 ; i < busProductoPedido.length ; i++){
            const nombre = busProductoPedido[i].producto
            const product = await Producto.findOne({ nombre : nombre})
            const id = product.id
            let stock = product.cantidad
            const cantidad = busProductoPedido[i].cantidad
            stock += cantidad
            await Producto.findByIdAndUpdate(id, { cantidad : stock }, { new : true})
            await Carrito.findByIdAndDelete(busProductoPedido[i]._id)
        }
        res.json({ message : 'Pedido eliminado' })
    }catch(err){
        // Enviamos un mensaje en caso de que no se pudo borrar el pedido
        res.status(500).json({ message : 'Error al borrar todo el pedido del cliente' })
        // Mostramos el mensaje en consola
        console.log(err)
    }
}

const listarProductosPedido = async (req, res) => {
    // Desestructuramos el objeto req.body
    // Extraemos las propiedades clientes en una variable
    const cliente = req.query.cliente
    // Creamos una variable para calcular el total del pedido
    let total = 0
    // Validar todos los campos llenos
    if (Object.values(req.body).includes('')) return res.status(400).json({ message: 'Lo sentimos, debes llenar todos los campos' })
    try{
        // Buscamos el cliente en la base de datos
        const busCliente = await Registro.findById( cliente )
        // Buscamos los producto del pedido en la base de datos
        const busProductoPedido = await Carrito.find({ cliente : cliente})
        // En caso de que no se encuentre ese cliente enviamos un mensaje
        if(!busCliente || busCliente.length === 0) return res.json({ message : 'No existe ese cliente' })
        // En caso de que no se encuentre ese cliente enviamos un mensaje
        if(!busProductoPedido || busProductoPedido.length === 0) return res.json({ message : 'Ese cliente no se encuentra haciendo un pedido' })
        let mostrar = {}
        mostrar[busCliente._id] = []
        for (i = 0 ; i < busProductoPedido.length ; i++){
            const nombreProducto = busProductoPedido[i].producto.charAt(0).toUpperCase() + busProductoPedido[i].producto.slice(1).toLowerCase();
            mostrar[busCliente._id].push({
                'Producto' : nombreProducto,
                'Cantidad' : busProductoPedido[i].cantidad,
                'Precio' : busProductoPedido[i].precio
            })
            // Sacamos el precio del producto
            const precio = busProductoPedido[i].precio
            // Sacamos la cantidad del producto
            const cantidad = busProductoPedido[i].cantidad
            // Calculamos el valor
            const subtotal = precio*cantidad
            // Almacenamos en total
            total += subtotal
        }
        // Mostramos el total
        mostrar[busCliente._id].push({
            'Total' : total
        })
        // Mostramos todo el pedido
        res.json({ Pedido : mostrar})
    }catch(err){
        // Enviamos un mensaje en caso de que no se pudo mostrar el pedido
        res.status(500).json({ message : 'Error al mostrar todo el pedido del cliente' })
        // Mostramos el mensaje en consola
        console.log(err)
    }
}

const mostrarPedidos = async (req, res) => {
    // Desestructuramos el objeto req.body
    // Extraemos las propiedades cliente en una variable
    const cliente = req.query.cliente
    // Validar todos los campos llenos
    if (Object.values(req.body).includes('')) return res.status(400).json({ message: 'Lo sentimos, debes llenar todos los campos' })
    try{
        // Buscamos el cliente en la base de datos
        const busCliente = await Registro.findById( cliente )
        // En caso de que no se encuentre ese cliente enviamos un mensaje
        if(!busCliente || busCliente.length === 0) return res.json({ message : 'No existe ese cliente' })
        // Buscamos en la base de datos todos los pedidos del cliente
        const Pedidos = await Pedido.find({ cliente : cliente })
        // En caso de que no existan Pedidos realizados previamente
        if (!Pedidos || Pedidos.length === 0) return res.json({ message: 'No existen Pedidos realizados previamente' });
        // Convertimos la primera letra en mayuscula y el resto en minuscula de los nombres de los productos
        const listarPedidos = Pedidos.map(pedido => {
            const productosFormateados = pedido.producto.map(producto => {
              const nombreProducto = producto.charAt(0).toUpperCase() + producto.slice(1).toLowerCase();
              return nombreProducto;
            });
            return { ...pedido.toObject(), producto: productosFormateados };
          });
        // Mostramos todos los Pedidos del cliente
        res.status(200).json(listarPedidos);
    }catch(err){
        // Enviamos un mensaje en caso de que no se pudo mostrar el pedido
        res.status(500).json({ message : 'Error al mostrar los pedidos del cliente' })
        // Mostramos el mensaje en consola
        console.log(err)
    }
}

const buscarPedido = async (req, res) => {
    // Desestructuramos el objeto req.body
    // Extraemos las propiedades cliente en una variable
    const cliente = req.query.cliente
    // Extraemos la id de la url
    const PedidoId = req.params.id
    // Validar todos los campos llenos
    if (Object.values(req.body).includes('')) return res.status(400).json({ message: 'Lo sentimos, debes llenar todos los campos' })
    try{
        // Buscamos el cliente en la base de datos
        const busCliente = await Registro.findById( cliente )
        // En caso de que no se encuentre ese cliente enviamos un mensaje
        if(!busCliente || busCliente.length === 0) return res.json({ message : 'No existe ese cliente' })
        // Buscamos en la base de datos todos los pedidos del cliente
        const Pedidos = await Pedido.find({ _id : PedidoId})
        // En caso de que no exista ese Favorito enviamos un mensaje
        if (!Pedidos || Pedidos.length === 0) return res.json({ message: 'No existe ese Pedido del Cliente' });
        // Convertimos la primera letra en mayuscula y el resto en minuscula de los nombres de los productos
        const listarPedidos = Pedidos.map(pedido => {
            const productosFormateados = pedido.producto.map(producto => {
                const nombreProducto = producto.charAt(0).toUpperCase() + producto.slice(1).toLowerCase();
                return nombreProducto;
            });
            return { ...pedido.toObject(), producto: productosFormateados };
        });
        // Mostramos todos los Pedidos del cliente
        res.status(200).json(listarPedidos);
    }catch(err){
        // Enviamos un mensaje en caso de que no se pudo buscar el pedido
        res.status(500).json({ message : 'Error al buscar el pedido del cliente' })
        // Mostramos el mensaje en consola
        console.log(err)
    }
}

const registroPedido = async (req, res) => {
    // Desestructuramos el objeto req.body
    // Extraemos las propiedades cliente y comision en variables separadas
    const cliente = req.body.cliente
    let comision = req.body.comision
    // Validar todos los campos llenos
    if (Object.values(req.body).includes('')) return res.status(400).json({ message: 'Lo sentimos, debes llenar todos los campos' })
    // Creamos variables temporales que nos serviran para poder hacer calculos
    let total = 0
    // En caso de que el cliente quiera que el pedido sea a domicilio tendra un costo de 50 ctvs adicional
    if(comision == true) {
        total = 0.5
    }
    // En caso de que no el valor seguira siendo 0 y seteamos comision a false
    else {
        comision = false
        total = 0
    }
    try{
        // Buscamos el cliente en la base de datos
        const busCliente = await Registro.findById( cliente )
        // Buscamos los productos del pedido en la base de datos
        const busProductoPedido = await Carrito.find({ cliente : cliente})
        // En caso de que no se encuentre ese cliente enviamos un mensaje
        if(!busCliente || busCliente.length === 0) return res.json({ message : 'No existe ese cliente' })
        // En caso de que no se encuentre ese producto en el pedido enviamos un mensaje
        if(!busProductoPedido || busProductoPedido.length === 0) return res.json({ message : 'Ese cliente no se encuentra haciendo un pedido' })
        const busPedido = await Pedido.find({ cliente : cliente })
        if(busPedido.length > 0 ) {
            if(busPedido[busPedido.length - 1].estado != 'Pagado')
                return res.json({ message : `Antes de realizar otro pedido pague el anterior, el valor a pagar es de ${busPedido[busPedido.length - 1].total}`})
        }
        // Almacenamos el nombre del cliente en una variable
        const nombreCliente = busCliente.nombre + ' ' + busCliente.apellido
        // Creamos una nueva instancia 
        const nuevoPedido = new Pedido({
            _id : new mongoose.Types.ObjectId,
            cliente : cliente,
            nombre : nombreCliente,
            producto : [],
            cantidad : [],
            precio : [],
            comision : comision,
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
        for (i = 0 ; i < busProductoPedido.length ; i++){
            // Almacenamos la informacion de producto cantidad precio
            const producto = busProductoPedido[i].producto;
            const cantidad = busProductoPedido[i].cantidad;
            const precio = busProductoPedido[i].precio;
            // Calculamos el precio del total del pedido
            const subtotal = precio*cantidad
            // Lo vamos almacenando
            total += subtotal
            // Subimos la informacion de producto cantidad precio al array
            nuevoPedido.producto.push(producto);
            nuevoPedido.cantidad.push(cantidad);
            nuevoPedido.precio.push(precio);
            const nombreProducto = busProductoPedido[i].producto.charAt(0).toUpperCase() + busProductoPedido[i].producto.slice(1).toLowerCase();
            mostrar[busCliente._id][0].Producto.push(nombreProducto)
            mostrar[busCliente._id][0].Cantidad.push(cantidad)
            mostrar[busCliente._id][0].Precio.push(precio)
            // Vamos eliminando cada producto de la coleccion Carrito
            await Carrito.findByIdAndDelete(busProductoPedido[i]._id)
        }
        mostrar[busCliente._id].push({
            'Total' : total,
            'Fecha' : nuevoPedido.fecha
        })
        // Guardamos el total del pedido
        nuevoPedido.total = total;
        // Guardamos en la base de datos
        await nuevoPedido.save()
        const email = busCliente.email
        const pedido = String(nuevoPedido._id)
        // Enviamos un correo al cliente respecto a su pedido
        await sendMailToConfirmBuyOfUser(email, pedido)
        // Enviamos un mensaje
        res.json({ message : 'Pedido realizado con exito', Pedido : mostrar })
    }catch(err){
        // Enviamos un mensaje en caso de que no se pudo guardar el pedido
        res.status(500).json({ message : 'Error al guardar el pedido del cliente' })
        // Mostramos el mensaje en consola
        console.log(err)
    }
}

const verPedido = async(req, res) => {
    // Extraemos el id de la url
    const PedidoId = req.params.id
    try{
        const Pedidos = await Pedido.find({ _id : PedidoId})
        // En caso de que no exista ese Favorito enviamos un mensaje
        if (!Pedidos || Pedidos.length === 0) return res.json({ message: 'No existe ese Pedido del Cliente' });
        // Convertimos la primera letra en mayuscula y el resto en minuscula de los nombres de los productos
        const listarPedidos = Pedidos.map(pedido => {
            const productosFormateados = pedido.producto.map(producto => {
                const nombreProducto = producto.charAt(0).toUpperCase() + producto.slice(1).toLowerCase();
                return nombreProducto;
            });
            return { ...pedido.toObject(), producto: productosFormateados };
        });
        // Mostramos todos los Pedidos del cliente
        res.status(200).json(listarPedidos);
    }catch(err){
        // Enviamos un mensaje en caso de que no se pudo buscar el pedido
        res.status(500).json({ message : 'Error mostrar el pedido del cliente' })
        // Mostramos el mensaje en consola
        console.log(err)
    }
}

const mostrarPedidosAdministrador = async (req, res) => {
    try {
        // Buscamos los pedidos en la bdd
        const Pedidos = await Pedido.find()
        // En caso de que no existan pedidos enviamos un mensaje
        if(!Pedidos || Pedidos.length === 0) return res.json({ message : 'No existen pedidos'})
        // Mostramos los pedidos
        res.json(Pedidos)
    } catch(err){
        // Enviamos un mensaje en caso de que no se pudo mostrar todos los pedidos
        res.json({ message : 'Error al mostrar todos los pedidos'})
        // Mostramos los errores
        console.log(err)
    }
}

const buscarPedidoAdministrador = async (req, res) => {
    // Desestructuramos el objeto req.body
    // Extraemos las propiedades telefono y fecha en variables separadas
    const { telefono, fecha } = req.body
    // Declaramos el inicio y el fin de las fechas
    const inicio = new Date(fecha)
    const fin = new Date(fecha)
    // Configurar la hora para indicar el final del día 
    fin.setUTCHours(23, 59, 59, 999);
    try {
        // Buscamos los pedidos en la bdd
        let cliente = await Registro.findOne({ telefono : telefono })
        cliente = cliente.id
        // En caso de que no existan pedidos enviamos un mensaje
        if(!cliente || cliente.length === 0) return res.json({ message : 'No ese cliente'})
        const Pedidos = await Pedido.find({
            cliente : cliente,
            fecha : {
                $gte : inicio,
                $lt : fin
            }
        })
        // Mostramos los pedidos
        res.json(Pedidos)
    } catch(err){
        // Enviamos un mensaje en caso de que no se pudo mostrar todos los pedidos
        res.json({ message : 'Error al mostrar todos los pedidos'})
        // Mostramos los errores
        console.log(err)
    }
}

module.exports = {
    agregarProductoPedido,
    actualizarProductoPedido,
    borrarProductoPedido,
    eliminarPedido,
    listarProductosPedido,
    mostrarPedidos,
    buscarPedido,
    registroPedido,
    verPedido,
    mostrarPedidosAdministrador,
    buscarPedidoAdministrador
}