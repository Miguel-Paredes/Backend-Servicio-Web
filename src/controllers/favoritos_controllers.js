// Importamos el modelo Favorito
const Favorito = require ('../models/favoritos.js')
// Importamos el modelo Producto
const Producto = require ('../models/productos.js')
// Importamos el modelo Registro
const Registro = require ('../models/login.js')
// Importamos moongose
const mongoose = require ('mongoose')

const mostrarFavoritos = async (req, res) => {
    try {
        // Buscamos en la base de datos los Favoritos de un cliente en especifico
        const Favoritos = await Favorito.find({ cliente: req.query.cliente });
        // En caso de que no existan Favoritos registrados, enviamos un mensaje
        if (!Favoritos || Favoritos.length === 0) return res.json({ message: 'No existen Favoritos' });
        // Modificamos el nombre de cada Favorito para tener la primera inicial en mayúscula
        // y las demás en minúscula
        const listarFavoritos = Favoritos.map(Favorito => {
            const nombreFavorito = Favorito.nombre.charAt(0).toUpperCase() + Favorito.nombre.slice(1).toLowerCase();
            const descripcionFavorito = Favorito.descripcion.charAt(0).toUpperCase() + Favorito.descripcion.slice(1).toLowerCase();
            const categoriaFavorito = Favorito.categoria.charAt(0).toUpperCase() + Favorito.categoria.slice(1).toLowerCase();
            return { ...Favorito.toObject(), nombre: nombreFavorito, descripcion: descripcionFavorito, categoria: categoriaFavorito };
        });
        // Mostramos todos los Favoritos
        res.status(200).json(listarFavoritos);
    } catch (err) {
        // Enviamos un mensaje de error en caso de que no se puedan obtener los Favoritos
        res.status(500).json({ message: 'Error al obtener los Favoritos' });
        // Mostramos los errores
        console.log(err);
    }
};

const buscarFavorito = async (req, res) => {
    // Obtenemos el valor de id de la url
    const FavoritoId = req.params.id
    try{
        // Buscamos en la base de datos ese Favorito
        const Favoritos = await Favorito.find({ _id : FavoritoId, cliente : req.query.cliente })
        // En caso de que no exista ese Favorito enviamos un mensaje
        if (!Favoritos || Favoritos.length === 0) return res.json({ message: 'No existe ese Favorito' });
        // Modificamos el nombre del Favorito para tener la primera inicial en mayúscula y las demás en minúscula
        const listarFavoritos = Favoritos.map(Favorito => {
            const nombreFavorito = Favorito.nombre.charAt(0).toUpperCase() + Favorito.nombre.slice(1).toLowerCase();
            const descripcionFavorito = Favorito.descripcion.charAt(0).toUpperCase() + Favorito.descripcion.slice(1).toLowerCase();
            const categoriaFavorito = Favorito.categoria.charAt(0).toUpperCase() + Favorito.categoria.slice(1).toLowerCase();
            return { ...Favorito.toObject(), nombre: nombreFavorito, descripcion: descripcionFavorito, categoria: categoriaFavorito };
        });
        // Mostramos el Favorito
        res.status(200).json(listarFavoritos);
    }catch (err){
        // Enviamos un mensaje de error en caso de que no se puedan mostrar el Favorito
        res.status(500).json({ message : 'Error al obtener el Favorito'})
        // Mostramos los errores
        console.log(err)
    }
};

const registrarFavorito = async (req, res) => {
    try {
        // Buscamos el producto
        const producto = await Producto.findById(req.body.producto);
        // Buscamos el cliente
        const cliente = await Registro.findById(req.body.cliente);
        // Verificamos si el producto y el cliente existen
        if(!cliente && !producto) return res.json({ message: 'El producto y el cliente no existen' });
        // Verificamos si el producto existe
        if (!producto) return res.json({ message: 'El producto no existe' });
        // Verificamos si el cliente existe
        if (!cliente) return res.json({ message: 'El cliente no existe' });
        // Almacenamos el id de producto
        const idProducto = producto.id
        // Buscamos el producto en la lista de favoritos
        const favoritos = await Favorito.find({ cliente : cliente, producto : idProducto })
        // En caso de que el producto ya se encuentre en favoritos enviamos un mensaje
        if(favoritos != 0) return res.json({ message : 'Ese producto ya se encuentra en favoritos'})
        // Creamos una nueva instancia de Favorito
        const nuevoFavorito = new Favorito({
            _id: new mongoose.Types.ObjectId(),
            producto: producto._id,
            nombre: producto.nombre,
            precio: producto.precio,
            descripcion: producto.descripcion,
            categoria: producto.categoria,
            imagen:{
                public_id: producto.imagen.public_id,
                secure_url: producto.imagen.secure_url
            },
            cliente
        });
        await nuevoFavorito.save();
        // Enviamos un mensaje de Favorito Registrado y los detalles del Favorito registrado
        res.status(200).json({ message: 'Favorito Registrado', Favorito: nuevoFavorito });
    } catch (err) {
        // Enviamos un mensaje de error en caso de que no se pueda registrar el Favorito
        res.status(500).json({ message: 'Error al registrar el Favorito' });
        // Mostramos los errores
        console.log(err);
    }
};

const actualizarFavorito = async (productoId) => {
    try {
        // Buscamos el producto correspondiente al identificador proporcionado
        const producto = await Producto.findById(productoId);
        // Almacenamos esta informacion en otra variable
        const busc = productoId
        // Actualizamos los campos del favorito con la información del producto actualizada
        const nombre = producto.nombre
        const precio = producto.precio
        const descripcion = producto.descripcion
        const categoria = producto.categoria
        const imagen = producto.imagen
        // Buscamos el favorito correspondiente al producto
        const buscarFavorito = await Favorito.find({ producto : producto})
        // Usamos un bucle para que busque en todos los favoritos el producto y los actualice
        for(let i = 0 ; i < buscarFavorito.length ; i++){
            // Usamos la funcion String para poder comparar mas facilmente
            if(String(buscarFavorito[i].producto) === String(busc)){
                // Buscamos y actualizamos todos los productos
                await Favorito.findByIdAndUpdate(
                    buscarFavorito[i]._id,
                    {
                        nombre,
                        precio,
                        descripcion,
                        categoria,
                        imagen,
                    },
                    {
                        new : true
                    }
                    );
            }
        }
        // Enviamos un mensaje a consola indicando que ya se actualizaron todos los favoritos
        console.log('Favoritos actualizados')
    } catch (err) {
        // Enviamos un mensaje de error en caso de que no se pueda actualizar el Favorito
        console.log({ message: 'Error al actualizar los Favoritos' });
        // Mostramos los errores
        console.log(err);
    }
};

const borrarFavorito = async (req, res) => {
    // Obtenemos el valor de id de la URL
    const FavoritoId = req.params.id;
    // Obtenemos el valor de cliente del body
    const idcliente = req.body.cliente
    try {
        // Buscamos en la base de datos los Favoritos de un cliente en especifico
        const cliente = await Favorito.find({ _id : idcliente});
        if(!cliente) return res.json({ message : 'No existe ese cliente' })
        // Buscamos en la base de datos ese Favorito y lo eliminamos
        const FavoritoEliminado = await Favorito.findByIdAndDelete(FavoritoId);
        // Indicamos un mensaje en caso de que no exista ese producto
        if (!FavoritoEliminado) return res.status(404).json({ message: 'No se encontró el Favorito para borrar' });
        // Enviamos un mensaje indicando que se borró el Favorito
        res.status(200).json({ message: 'Favorito borrado' });
    } catch (err) {
        // Enviamos un mensaje de error en caso de que no se pueda borrar el Favorito
        res.status(500).json({ message: 'Error al borrar el Favorito' });
        // Mostramos los errores
        console.log(err);
    }
};

const eliminarFavorito = async (productoId) => {
    try{
        // Almacenamos la informacion de productoId en una variable
        const busc = productoId
        // Buscamos el favorito correspondiente al producto
        const buscarFavorito = await Favorito.find()
        // Usamos un bucle para que busque en todos los favoritos el producto y los elimine
        for(let i = 0 ; i < buscarFavorito.length ; i++){
            if(buscarFavorito[i].producto == productoId){
                const idProducto = buscarFavorito[i]._id
                await Favorito.findByIdAndDelete(idProducto)
            }
        }
        // Enviamos un mensaje a consola indicando que ya se eliminaron todos los favoritos
        console.log('Favoritos eliminados')
    }catch(err){
        // Enviamos un mensaje de error en caso de que no se pueda eliminar los Favoritos
        console.log('Error al eliminar todos los favoritos')
        // Mostramos los errores
        console.log(err)
    }
};

const actualizarCategoriaFavorito = async (categoria) => {
    try{
        // Buscamos todos los productos con esa categoria
        const favorito = await Favorito.find()
        // En caso de que no existan productos con esa categoria
        if(favorito.length === 0 || !favorito) return console.log('No existen productos favoritos con esa categoria')
        else{
            // Actualizamos la categoria en cada producto
            for (let i = 0 ; i < favorito.length ; i++){
                if(favorito[i].categoria == categoria){
                    await Favorito.findByIdAndUpdate(
                        favorito[i].id,
                        { categoria: categoria },
                        { new: true }
                    )
                }
            }
            // Enviamos un mensaje a consola indicando que ya se actualizaron todos los productos
            console.log('Categoria de productos favoritos actualizados')
        }
    } catch (err) {
        // Enviamos un mensaje de error en caso de que no se pueda actualizar la categoria
        console.log({ message: 'Error al actualizar la categoria de los productos favoritos' });
        // Mostramos los errores
        console.log(err);
    }
};

const categoriaFavorito = async (req, res) => {
    // Obtenemos el valor de la url
    let categoriaID = req.params.categoria
    // Colocamos el nombre en mayuscula
    categoriaID = categoriaID.toUpperCase()
    // Obtenemos el id del cliente del body
    const cliente = req.query.cliente
    try{
        // Buscamos en la base de datos ese Favorito
        const Favoritos = await Favorito.find({ categoria : categoriaID, cliente : cliente })
        // En caso de que no exista ese Favorito enviamos un mensaje
        if (!Favoritos || Favoritos.length === 0) return res.json({ message: 'No existen Favoritos en esa categoria' });
        // Modificamos el nombre del Favorito para tener la primera inicial en mayúscula y las demás en minúscula
        const listarFavoritos = Favoritos.map(Favorito => {
            const nombreFavorito = Favorito.nombre.charAt(0).toUpperCase() + Favorito.nombre.slice(1).toLowerCase();
            const descripcionFavorito = Favorito.descripcion.charAt(0).toUpperCase() + Favorito.descripcion.slice(1).toLowerCase();
            const categoriaFavorito = Favorito.categoria.charAt(0).toUpperCase() + Favorito.categoria.slice(1).toLowerCase();
            return { ...Favorito.toObject(), nombre: nombreFavorito, descripcion: descripcionFavorito, categoria: categoriaFavorito };
        });
        // Mostramos el Favorito
        res.status(200).json(listarFavoritos);
    }catch (err){
        // Enviamos un mensaje de error en caso de que no se puedan mostrar el Favorito
        res.status(500).json({ message : 'Error al obtener el Favorito'})
        // Mostramos los errores
        console.log(err)
    }
}

// Exportamos los controladores
module.exports = {
    mostrarFavoritos,
    buscarFavorito,
    registrarFavorito,
    actualizarFavorito,
    borrarFavorito,
    eliminarFavorito,
    actualizarCategoriaFavorito,
    categoriaFavorito
}