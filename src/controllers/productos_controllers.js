const Producto = require ('../models/productos.js')
const fs = require ('fs-extra')
const { deleteImage, uploadImage } = require ("../config/cloudinary.js")
const mongoose = require ('mongoose')

const mostrarProductos = async (req, res) => {
    try {
        // Buscamos en la base de datos los Productos
        const Productos = await Producto.find();
        // En caso de que no existan Productos registrados, enviamos un mensaje
        if (!Productos || Productos.length === 0) return res.json({ message: 'No existen Productos' });
        // Modificamos el nombre de cada Producto para tener la primera inicial en mayúscula
        // y las demás en minúscula
        const listarProductos = Productos.map(Producto => {
            const nombreProducto = Producto.nombre.charAt(0).toUpperCase() + Producto.nombre.slice(1).toLowerCase();
            const descripcionProducto = Producto.descripcion.charAt(0).toUpperCase() + Producto.descripcion.slice(1).toLowerCase();
            const categoriaProducto = Producto.categoria.charAt(0).toUpperCase() + Producto.categoria.slice(1).toLowerCase();
            return { ...Producto.toObject(), nombre: nombreProducto, descripcion: descripcionProducto, categoria: categoriaProducto };
        });
        // Mostramos todos los Productos
        res.status(200).json(listarProductos);
    } catch (err) {
        // Enviamos un mensaje de error en caso de que no se puedan obtener los Productos
        res.status(500).json({ message: 'Error al obtener los Productos' });
        // Mostramos los errores
        console.log(err);
    }
};

const buscarProducto = async (req, res) => {
    // Obtenemos el valor de id de la url
    const ProductoId = req.params.id
    try{
        // Buscamos en la base de datos ese Producto
        const Productos = await Producto.find({ ProductoId })
        // En caso de que no exista ese Producto enviamos un mensaje
        if (!Productos || Productos.length === 0) return res.json({ message: 'No existe ese Producto' });
        // Modificamos el nombre del Producto para tener la primera inicial en mayúscula y las demás en minúscula
        const listarProductos = Productos.map(Producto => {
            const nombreProducto = Producto.nombre.charAt(0).toUpperCase() + Producto.nombre.slice(1).toLowerCase();
            const descripcionProducto = Producto.descripcion.charAt(0).toUpperCase() + Producto.descripcion.slice(1).toLowerCase();
            const categoriaProducto = Producto.categoria.charAt(0).toUpperCase() + Producto.categoria.slice(1).toLowerCase();
            return { ...Producto.toObject(), nombre: nombreProducto, descripcion: descripcionProducto, categoria: categoriaProducto };
        });
        // Mostramos el Producto
        res.status(200).json(listarProductos);
    }catch (err){
        // Enviamos un mensaje de error en caso de que no se puedan mostrar el Producto
        res.status(500).json({ message : 'Error al obtener el Producto'})
        // Mostramos los errores
        console.log(err)
    }
}

const registrarProducto = async (req, res) => {
    // Desestructuramos el objeto req.body
    // Extraemos las propiedades nombre, cantidad, precio, descripcion y categoria en variables separadas 
    const { nombre, cantidad, precio, descripcion, categoria, imagen } = req.body
    try {
        // Buscamos si el nombre del Producto ya se encuentra registrado
        const exisNombre = await Producto.findOne({ nombre })
        // En caso de ya estar registrado enviamos un mensaje
        if(exisNombre) return res.json({ message : 'Ya existe un Producto con ese nombre'})
        // Colocamos condicionales para evitar que se ingresen numeros negativos
        // En caso de que la cantidad sea menor a 1 y el precio menor a 0 enviamos un mensaje
        if (cantidad < 0 && precio <= 0) return res.json({ message: 'La cantidad debe ser mayor a 1 y el precio debe ser mayor a 0' });
        // En caso de que la cantidad sea menor a 1 enviamos un mensaje
        else if (cantidad <= 0 ) return res.json({ message : 'La cantidad debe de ser mayor a 1'})
        // En caso de que el precio menor a 0 enviamos un mensaje
        else if (precio <= 0) return res.json ({ message : 'El precio debe de ser mayor a 0'})
        // Creamos una nueva instancia 
        const nuevoProducto = new Producto({
            // Genera un nuevo ID para el Producto
            _id: new mongoose.Types.ObjectId,
            // Asignamos el valor de la variable nombre a la propiedad nombre
            nombre,
            // Asignamos el valor de la variable cantidad a la propiedad cantidad
            cantidad,
            // Asignamos el valor de la variable precio a la propiedad precio
            precio,
            // Asignamos el valor de la variable descripcion a la propiedad descripcion
            descripcion,
            // Asignamos el valor de la variable categoria a la propiedad categoria
            categoria
        });
        if(imagen){
            // Carga la imagen utilizando una función 'uploadImage' y espera a que se complete
            const imageUpload = await uploadImage(req.files.imagen.tempFilePath); 
            nuevoProducto.imagen = {
                // Asignamos el public_id de la imagen cargada a la propiedad public_id
                public_id: imageUpload.public_id, 
                // Asignamos la secure_url de la imagen cargada a la propiedad secure_url
                secure_url: imageUpload.secure_url 
            };
            // Eliminamos el archivo temporal de la imagen utilizando el módulo fs
            await fs.unlink(req.files.image.tempFilePath); 
        }
        // Guardamos el nuevo Producto en la base de datos
        await nuevoProducto.save(); 
        // Enviamos un mensaje de Producto Registrado y los detalles del Producto registrado
        res.status(200).json({ message: 'Producto Registrado', Producto: nuevoProducto }); 
    }catch (err){
        // Enviamos un mensaje de error en caso de que no se pueda registrar el Producto
        res.status(500).json({ message : 'Error al registrar el Producto'})
        // Mostramos los errores
        console.log(err)
    }
}

const actualizarProducto = async (req, res) => {
    // Obtenemos el valor de id de la url
    const ProductoId = req.params.id
    // Desestructuramos el objeto req.body
    // Extraemos las propiedades nombre, cantidad, precio, descripcion y categoria en variables separadas 
    const { nombre, cantidad, precio, descripcion, categoria, imagen } = req.body
    try{
        let ProductoActualizado = await Producto.findById( ProductoId )
        if(!ProductoActualizado) return res.status(404).json({ message : 'No se encontro el Producto para actualizar'})
        // Colocamos condicionales para evitar que se ingresen numeros negativos
        // En caso de que la cantidad sea menor a 1 y el precio menor a 0 enviamos un mensaje
        if (cantidad < 0 && precio <= 0) return res.json({ message: 'La cantidad debe ser mayor a 1 y el precio debe ser mayor a 0' });
        // En caso de que la cantidad sea menor a 1 enviamos un mensaje
        else if (cantidad <= 0 ) return res.json({ message : 'La cantidad debe de ser mayor a 1'})
        // En caso de que el precio menor a 0 enviamos un mensaje
        else if (precio <= 0) return res.json ({ message : 'El precio debe de ser mayor a 0'})
        ProductoActualizado = await Producto.findByIdAndUpdate(
            ProductoId,
            {
                nombre,
                cantidad,
                precio,
                descripcion,
                categoria
            },
            { new : true}
        )
        if(imagen){
            // Eliminamos la imagen de la base de datos
            await deleteImage(ProductoActualizado.imagen.public_id)
            // Carga la imagen utilizando una función 'uploadImage' y espera a que se complete
            const imageUpload = await uploadImage(req.files.imagen.tempFilePath); 
            ProductoActualizado.imagen = {
                // Asignamos el public_id de la imagen cargada a la propiedad public_id
                public_id: imageUpload.public_id, 
                // Asignamos la secure_url de la imagen cargada a la propiedad secure_url
                secure_url: imageUpload.secure_url 
            };
            // Eliminamos el archivo temporal de la imagen utilizando el módulo fs
            await fs.unlink(req.files.image.tempFilePath); 
        }
        // Guardamos el nuevo Producto en la base de datos
        await ProductoActualizado.save(); 
        // Enviamos un mensaje de Producto Registrado y los detalles del Producto registrado
        res.status(200).json({ message: 'Producto Registrado', Producto: ProductoActualizado }); 
    }catch (err){
        // Enviamos un mensaje de error en caso de que no se pueda actualizar el Producto
        res.status(500).json({ message : 'Error al actualizar el Producto'})
        // Mostramos los errores
        console.log(err)
    }
}

const borrarProducto = async (req, res) => {
    // Obtenemos el valor de id de la URL
    const productoId = req.params.id;
    try {
        // Buscamos en la base de datos ese Producto y lo eliminamos
        let productoEliminado = await Producto.findById(productoId);
        if (!productoEliminado) {
            return res.status(404).json({ message: 'No se encontró el Producto para borrar' });
        }
        if (productoEliminado.imagen.length != undefined) {
            // Eliminamos la imagen del Producto
            await deleteImage(productoEliminado.imagen.public_id);
        }
        // Eliminamos el Producto de la base de datos
        await Producto.findByIdAndDelete(productoId);
        // Enviamos un mensaje indicando que se borró el Producto
        res.status(200).json({ message: 'Producto borrado' });
    } catch (err) {
        // Enviamos un mensaje de error en caso de que no se pueda borrar el Producto
        res.status(500).json({ message: 'Error al borrar el Producto' });
        // Mostramos los errores
        console.log(err);
    }
};

module.exports = {
    mostrarProductos,
    buscarProducto,
    registrarProducto,
    actualizarProducto,
    borrarProducto
}