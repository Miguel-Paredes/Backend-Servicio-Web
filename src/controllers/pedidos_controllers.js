// Importamos mongoose
const mongoose = require ('mongoose');

// Importamos el modelo Pedido
const Pedido = require('../models/pedidos.js')

// Importamos el modelo Producto
const Producto = require ('../models/productos.js')

// Importamos el modelo Registro
const Registro = require ('../models/login.js')

// Creamos un json para almacenar la informacion de los pedidos de los clientes
let almacen = {}

const agregarProductoPedido = async (req, res) => {
    // Desestructuramos el objeto req.body
    // Extraemos las propiedades cliente producto y cantidad en variables separadas 
    const { cliente, producto, cantidad } = req.body
    // Verificamos si se quiere ingresar una cantidad menor a 0
    if(cantidad < 0) return res.json({ message : 'No se puede ingresar una cantidad negativa'})
    // Verificamos si se quiere ingresar una cantidad mayor a 20
    else if(cantidad > 20) return res.json({ message : 'La cantidad maxima es de 20'})
    try{
        // Buscamos el producto en la base de datos
        const busProducto = await Producto.findById( producto )
        // Buscamos el cliente en la base de datos
        const busCliente = await Registro.findById( cliente )
        // En caso de que no se encuentre ese producto enviamos un mensaje
        if(!busProducto || busProducto.length === 0) return res.json({ message : 'No existe ese producto' })
        // En caso de que no se encuentre ese cliente enviamos un mensaje
        if(!busCliente || busCliente.length === 0) return res.json({ message : 'No existe ese cliente' })
        // En caso de que no se hallan realizado pedidos agregamos el primer producto a un cliente
        if(Object.keys(almacen).length === 0){
            // Creamos un arreglo con el id del cliente
            almacen[cliente] = []
            // Agregamos el producto al pedido del cliente
            almacen[cliente].push({
                'Producto' : busProducto.nombre,
                'Precio' : busProducto.precio,
                'Cantidad' : cantidad
            })
        }else{
            // Creamos un boleano que nos indica si el cliente esta realizando un pedido
            let pedidoCliente = false
            // En caso de que ya existan pedidos, buscamos al cliente 
            for (busc in almacen){
                if(busc == cliente){
                    // En caso de que se encuentre el cliente colocamos true
                    pedidoCliente = true
                    // Si se encontro el cliente detenemos el bucle
                    break
                }
            }
            // Si el cliente ya tiene agregado un producto y quiere agregar otro
            if(pedidoCliente == true){
                // Extraemos toda la informacion del pedido del cliente
                const productosCliente = almacen[cliente]
                // Buscamos el producto en el pedido del cliente
                const productoExistente = productosCliente.find(productoPedido => productoPedido.Producto === busProducto.nombre)
                // Enviamos un mensaje en caso de que ya exista el producto en el pedido
                if (productoExistente) return res.json({ message: 'El producto ya fue agregado al pedido' })
                // Agregamos otro producto al pedido
                almacen[cliente].push({
                    'Producto' : busProducto.nombre,
                    'Precio' : busProducto.precio,
                    'Cantidad' : cantidad
                })
            }else{
                // En caso de que el cliente recien este agregando un producto
                almacen[cliente] = []
                // Agregamos un producto para el pedido del cliente
                almacen[cliente].push({
                    'Producto' : busProducto.nombre,
                    'Precio' : busProducto.precio,
                    'Cantidad' : cantidad
                })
            }
            // Volvemos a colocar el booleano en false
            pedidoCliente = false
        }
        res.json({ message : 'Producto agregado' })
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
    const { cliente, cantidad } = req.body
    // Extraemos el id del producto de la url
    const producto = req.params.id
    // Verificamos si se quiere ingresar una cantidad menor a 0
    if(cantidad < 0) return res.json({ message : 'No se puede ingresar una cantidad negativa'})
    // Verificamos si se quiere ingresar una cantidad mayor a 20
    else if(cantidad > 20) return res.json({ message : 'La cantidad maxima es de 20'})
    try{
        // Buscamos el producto en la base de datos
        const busProducto = await Producto.findById( producto )
        // Buscamos el cliente en la base de datos
        const busCliente = await Registro.findById( cliente )
        // En caso de que no se encuentre ese producto enviamos un mensaje
        if(!busProducto || busProducto.length === 0) return res.json({ message : 'No existe ese producto' })
        // En caso de que no se encuentre ese cliente enviamos un mensaje
        if(!busCliente || busCliente.length === 0) return res.json({ message : 'No existe ese cliente' })
        // Creamos un boleano que nos indica si el cliente esta realizando un pedido
        let actupedidoCliente = false
        for (busc in almacen){
            if(busc == cliente){
                // En caso de que se encuentre el cliente colocamos true
                actupedidoCliente = true
                // Si se encontro el cliente detenemos el bucle
                break
            }
        }
        // Verificamos si se encuentra el cliente
        if(actupedidoCliente == true){
            // Buscamos en los pedidos del cliente el producto
            almacen[cliente].forEach(item => {
                if(item['Producto'] === busProducto.nombre){
                    // Cuando lo encontremos actualizamos la cantidad
                    item['Cantidad'] = cantidad
                }
            });
            actupedidoCliente = false
            res.json({ message : 'Producto actualizado' })
        }
        // En caso de que no se encuentre el cliente enviamos un mensaje
        else return res.json({ message : 'Ese cliente no se encuentra haciendo un pedido'})
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
    try{
        // Buscamos el producto en la base de datos
        const busProducto = await Producto.findById( producto )
        // Buscamos el cliente en la base de datos
        const busCliente = await Registro.findById( cliente )
        // En caso de que no se encuentre ese producto enviamos un mensaje
        if(!busProducto || busProducto.length === 0) return res.json({ message : 'No existe ese producto' })
        // En caso de que no se encuentre ese cliente enviamos un mensaje
        if(!busCliente || busCliente.length === 0) return res.json({ message : 'No existe ese cliente' })
        // Verificamos si existe algun producto agregado al pedido
        if(!almacen.hasOwnProperty(cliente)) return res.json({ message : 'No existe ningun producto en el pedido'})
        // Verificamos si el cliente tiene agregado a su pedido mas de un producto
        if(Object.keys(almacen[cliente]).length > 1) {
            // Eliminamos un producto del pedido
            almacen[cliente] = almacen[cliente].filter(item => item['Producto'] !== busProducto.nombre)
            // Enviamos un mensaje indicando que se borro el producto
            res.json({ message : 'Producto borrado' })
        } 
        // Si solo tiene un producto en el pedido, eliminamos todo el pedido
        else {
            // Verificamos si existe el cliente y eliminamos el pedido
            if(almacen.hasOwnProperty(cliente)) {
                delete almacen[cliente]
            }
            // Enviamos un mensaje indicando que se borro el producto
            res.json({ message : 'Producto borrado' })
        }
    }catch(err){
        // Enviamos un mensaje en caso de que no se pudo borrar el producto al pedido
        res.status(500).json({ message : 'Error al borrar el producto del pedido del cliente' })
        // Mostramos el mensaje en consola
        console.log(err)
    }
}

const eliminarPedido = async (req, res) => {
    // Desestructuramos el objeto req.body
    // Extraemos las propiedades clientes y productos en variables separadas
    const cliente = req.body.cliente
    try{
        // Buscamos el cliente en la base de datos
        const busCliente = await Registro.findById( cliente )
        // En caso de que no se encuentre ese cliente enviamos un mensaje
        if(!busCliente || busCliente.length === 0) return res.json({ message : 'No existe ese cliente' })
        // Buscamos al cliente y borramos todo el pedido
        if(almacen.hasOwnProperty(cliente)) {
            delete almacen[cliente]
            res.json({ message : 'Pedido borrado' })
        }else{
            // En caso de que no se encuentre el cliente enviamos un mensaje
            res.json({ message : 'El cliente no ha realizado un pedido'})
        }
    }catch(err){
        // Enviamos un mensaje en caso de que no se pudo borrar el pedido
        res.status(500).json({ message : 'Error al borrar todo el pedido del cliente' })
        // Mostramos el mensaje en consola
        console.log(err)
    }
}

const listarProductosPedido = async (req, res) => {
    const cliente = req.body.cliente
    // Revisamos si el cliente ha agregado algun producto al pedido
    if(!almacen.hasOwnProperty(cliente)) return res.json({ message : 'No has agregado ningun producto al pedido'})
    try{
        // Buscamos el cliente en la base de datos
        const busCliente = await Registro.findById( cliente )
        // En caso de que no se encuentre ese cliente enviamos un mensaje
        if(!busCliente || busCliente.length === 0) return res.json({ message : 'No existe ese cliente' })
        for (busc in almacen){
            if(busc == cliente){
                // Mostramos todos los productos del pedido
                res.json(almacen[busc])
                // Si se encontro el cliente detenemos el bucle
                break
            }
        }
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
    const cliente = req.body.cliente
    try{
        // Buscamos el cliente en la base de datos
        const busCliente = await Registro.findById( cliente )
        // En caso de que no se encuentre ese cliente enviamos un mensaje
        if(!busCliente || busCliente.length === 0) return res.json({ message : 'No existe ese cliente' })
        // Buscamos en la base de datos todos los pedidos del cliente
        const Pedidos = await Pedido.find({ cliente : cliente })
        // En caso de que no existan Pedidos realizados previamente
        if (!Pedidos || Pedidos.length === 0) return res.json({ message: 'No existen Pedidos realizados previamente' });
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
    const cliente = req.body.cliente
    // Extraemos la id de la url
    const PedidoId = req.params.id
    try{
        // Buscamos el cliente en la base de datos
        const busCliente = await Registro.findById( cliente )
        // En caso de que no se encuentre ese cliente enviamos un mensaje
        if(!busCliente || busCliente.length === 0) return res.json({ message : 'No existe ese cliente' })
        // Buscamos en la base de datos todos los pedidos del cliente
        const Pedidos = await Pedido.find({ _id : PedidoId, cliente : cliente })
        // En caso de que no exista ese Favorito enviamos un mensaje
        if (!Pedidos || Pedidos.length === 0) return res.json({ message: 'No existe ese Pedido del Cliente' });
        // Mostramos el Pedidos del cliente
        res.status(200).json(Pedidos);
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
    // Revisamos si el cliente ha agregado algun producto al pedido
    if(!almacen.hasOwnProperty(cliente)) return res.json({ message : 'No has agregado ningun producto al pedido'})
    // Creamos variables temporales que nos serviran para poder hacer calculos
    let total = 0
    let cantidad = 0
    let precio = 0
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
        console.log(busCliente)
        // En caso de que no se encuentre ese cliente enviamos un mensaje
        if(!busCliente || busCliente.length === 0) return res.json({ message : 'No existe ese cliente' })
        // Creamos un boleano que nos indica si el cliente esta realizando un pedido
        let guardarPedidoCliente = false
        for (busc in almacen){
            if(busc == cliente){
                // En caso de que se encuentre el cliente colocamos true
                guardarPedidoCliente = true
                // Sacamos el precio total del pedido
                for(i in almacen[busc]){
                    cantidad = almacen[busc][i].Cantidad
                    precio = almacen[busc][i].Precio
                    subtotal = cantidad * precio
                    total += subtotal
                }
                // Si se encontro el cliente detenemos el bucle
                break
            }
        }
        // Creamos una nueva instancia 
        const nuevoPedido = new Pedido({
            _id : new mongoose.Types.ObjectId,
            cliente : cliente,
            producto : [],
            cantidad : [],
            precio : [],
            comision : comision,
            total : total
        })
        // Buscamos el pedido del cliente
        for (busc in almacen){
            if(busc == cliente){
                // Recorremos los datos del archivo JSON y agregas los valores a los campos de tipo array
                for (i = 0 ; i < almacen[busc].length ; i++){
                    // Almacenamos la informacion de producto cantidad precio
                    const producto = almacen[busc][i].Producto;
                    const cantidad = almacen[busc][i].Cantidad;
                    const precio = almacen[busc][i].Precio;
                    // Subimos la informacion de producto cantidad precio al array
                    nuevoPedido.producto.push(producto)
                    nuevoPedido.cantidad.push(cantidad)
                    nuevoPedido.precio.push(precio)
                }
            }
        }
        // Guardamos en la base de datos
        await nuevoPedido.save()
        // Eliminamos el pedido del json una vez se haya almacenado en la bdd
        if(almacen.hasOwnProperty(cliente)) {
            delete almacen[cliente]
        }
        // Enviamos un mensaje
        res.json({ message : 'Pedido realizado con exito', Pedido : nuevoPedido })
    }catch(err){
        // Enviamos un mensaje en caso de que no se pudo guardar el pedido
        res.status(500).json({ message : 'Error al guardar el pedido del cliente' })
        // Mostramos el mensaje en consola
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
    registroPedido
}