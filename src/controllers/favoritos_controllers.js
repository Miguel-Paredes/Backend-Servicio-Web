const Favorito = require ('../models/favoritos.js')
const Producto = require ('../models/productos.js')
const mongoose = require ('mongoose')

const mostrarFavoritos = async (req, res) => {
    try {
        // Buscamos en la base de datos los Favoritos
        const Favoritos = await Favorito.find();
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
        const Favoritos = await Favorito.find({ FavoritoId })
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
}

const registrarFavorito = async (req, res) => {
    try {
        // Buscamos el producto correspondiente al identificador proporcionado
        const producto = await Producto.findById(req.body.producto);
        // Verificamos si el producto existe
        if (!producto) return res.json({ message: 'El producto no existe' });
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
            }
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
}

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
        const buscarFavorito = await Favorito.find({producto})
        // Usamos un bucle para que busque en todos los favoritos el producto y los actualice
        for(let i = 0 ; i < buscarFavorito.length ; i++){
            // Usamos la funcion String para poder comparar mas facilmente
            if(String(buscarFavorito[i].producto) === String(busc)){
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
}

const borrarFavorito = async (req, res) => {
    // Obtenemos el valor de id de la URL
    const FavoritoId = req.params.id;
    try {
        // Buscamos en la base de datos ese Favorito y lo eliminamos
        const FavoritoEliminado = await Favorito.findByIdAndDelete(FavoritoId);
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
        const buscarFavorito = await Favorito.find({productoId})
        // Usamos un bucle para que busque en todos los favoritos el producto y los elimine
        for(let i = 0 ; i < buscarFavorito.length ; i++){
            // Usamos la funcion String para poder comparar mas facilmente
            if(String(buscarFavorito[i].producto) === String(busc)){
                await Favorito.findByIdAndDelete(buscarFavorito[i]._id)
            }
        }
        // Enviamos un mensaje a consola indicando que ya se eliminaron todos los favoritos
        console.log('Favoritos eliminados')
    }catch(err){
        console.log('Error al eliminar todos los favoritos')
        console.log(err)
    }
}

module.exports = {
    mostrarFavoritos,
    buscarFavorito,
    registrarFavorito,
    actualizarFavorito,
    borrarFavorito,
    eliminarFavorito
}