import Producto from '../models/productos.js'
import fs from 'fs-extra'
import { deleteImage, uploadImage } from "../config/cloudinary"
import mongoose from 'mongoose'

const mostrarProductos = async (req, res) => {
    try {
        // Buscamos en la base de datos los productos
        const productos = await Producto.find();
        // En caso de que no existan productos registrados, enviamos un mensaje
        if (!productos) return res.json({ message: 'No existen productos' });
        // Modificamos el nombre de cada producto para tener la primera inicial en mayúscula
        // y las demás en minúscula
        const listarProductos = productos.map(producto => {
            const nombreProducto = producto.nombre.charAt(0).toUpperCase() + producto.nombre.slice(1).toLowerCase();
            return { ...producto.toObject(), nombre: nombreProducto };
        });
        // Mostramos todos los productos
        res.status(200).json(listarProductos);
    } catch (err) {
        // Enviamos un mensaje de error en caso de que no se puedan obtener los productos
        res.status(500).json({ message: 'Error al obtener los productos' });
        // Mostramos los errores
        console.log(err);
    }
};

const buscarProducto = async (req, res) => {
    // Obtenemos el valor de id de la url
    const productoId = req.params.id
    try{
        // Buscamos en la base de datos ese producto
        const productos = await Producto.findOne({ productoId })
        // En caso de que no exista ese producto enviamos un mensaje
        if(!productos) return console.log('No existe ese producto')
        // Modificamos el nombre del producto para tener la primera inicial en mayúscula y las demás en minúscula
        const nombProducto = producto.nombre.charAt(0).toUpperCase() + producto.nombre.slice(1).toLowerCase();
        const nombreProducto = { ...producto.toObject(), nombre: nombProducto };
        // Mostramos el producto buscado
        res.status(200).json(nombreProducto);
    }catch (err){
        // Enviamos un mensaje de error en caso de que no se puedan mostrar el producto
        res.status(500).json({ message : 'Error al obtener el producto'})
        // Mostramos los errores
        console.log(err)
    }
}

const registrarProducto = async (req, res) => {
    // Desestructuramos el objeto req.body
    // Extraemos las propiedades nombre, cantidad, precio, descripcion y categoria en variables separadas 
    const { nombre, cantidad, precio, descripcion, categoria } = req.body
    try {
        // Buscamos si el nombre del producto ya se encuentra registrado
        const exisNombre = await Producto.findOne({ nombre })
        // En caso de ya estar registrado enviamos un mensaje
        if(!exisNombre) return res.json({ message : 'Ya existe un producto con ese nombre'})
        // Colocamos condicionales para evitar que se ingresen numeros negativos
        // En caso de que la cantidad sea menor a 1 y el precio menor a 0 enviamos un mensaje
        if (cantidad >= 1 || precio >= 0) return res.json({ message: 'La cantidad debe ser mayor a 1 y el precio debe ser mayor a 0' });
        // En caso de que la cantidad sea menor a 1 enviamos un mensaje
        else if (cantidad >= 1 ) return res.json({ message : 'La cantidad debe de ser mayor a 1'})
        // En caso de que el precio menor a 0 enviamos un mensaje
        else if (precio >= 0) return res.json ({ message : 'El precio debe de ser mayor a 0'})
        // Creamos una nueva instancia 
        const nuevoProducto = new Producto({
            // Genera un nuevo ID para el producto
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
        // Carga la imagen utilizando una función 'uploadImage' y espera a que se complete
        const imageUpload = await uploadImage(req.files.image.tempFilePath); 
        Producto.imagen = {
            // Asignamos el public_id de la imagen cargada a la propiedad public_id
            public_id: imageUpload.public_id, 
            // Asignamos la secure_url de la imagen cargada a la propiedad secure_url
            secure_url: imageUpload.secure_url 
        };
        // Eliminamos el archivo temporal de la imagen utilizando el módulo fs
        await fs.unlink(req.files.image.tempFilePath); 
        // Guardamos el nuevo producto en la base de datos
        await nuevoProducto.save(); 
        // Enviamos un mensaje de Producto Registrado y los detalles del producto registrado
        res.status(200).json({ message: 'Producto Registrado', Producto: nuevoProducto }); 
    }catch (err){
        // Enviamos un mensaje de error en caso de que no se pueda registrar el producto
        res.status(500).json({ message : 'Error al registrar el producto'})
        // Mostramos los errores
        console.log(err)
    }
}

const actualizarProducto = async (req, res) => {
    const productoId = req.params.id
    const { nombre, cantidad, precio, descripcion, categoria } = req.body
    try{
        const productoActualizado = await Producto.findById({ productoId })
        if(!productoActualizado) return res.status(404).json({ message : 'No se encontro el producto para actualizar'})

    }catch (err){
        res.status(500).json({ message : 'Error al actualizar el producto'})
        console.log(err)
    }
}

// Metodo para actualizar en la base de datos los datos del formulario
const updatePortafolio = async(req,res)=>{
    const portfolio = await Portfolio.findById(req.params.id).lean()
    if(portfolio._id != req.params.id) return res.redirect('/portafolios')
    
    if(req.files?.image) {
        if(!(req.files?.image)) return res.send("Se requiere una imagen")
        await deleteImage(portfolio.image.public_id)
        const imageUpload = await uploadImage(req.files.image.tempFilePath)
        const data ={
            title:req.body.title || portfolio.name,
            category: req.body.category || portfolio.category,
            description:req.body.description || portfolio.description,
            image : {
            public_id:imageUpload.public_id,
            secure_url:imageUpload.secure_url
            }
        }
        await fs.unlink(req.files.image.tempFilePath)
        await Portfolio.findByIdAndUpdate(req.params.id,data)
    }
    else{
        const {title,category,description}= req.body
        await Portfolio.findByIdAndUpdate(req.params.id,{title,category,description})
    }
    res.redirect('/portafolios')
}

const borrarProducto = async (req, res) => {
    // Obtenemos el valor de id de la url
    const productoId = req.params.id
    try{
        // Buscamos en la base de datos ese producto y lo eliminamos
        const productoEliminado = await Producto.findByIdAndDelete({ productoId })
        // Eliminamos la imagen del producto
        await deleteImage(portafolio.image.public_id)
        // En caso de que no exista ese producto enviamos un mensaje
        if(!productoEliminado) return res.satus(404).json({ message : 'No se encontro el producto para borrar'})
        // Enviamos un mensaje indicando que se borro el producto
        res.status(200).json({ message: 'Producto borrrado' });
    }catch (err){
        // Enviamos un mensaje de error en caso de que no se puedan borrar el producto
        res.status(500).json({ message : 'Error al borrar el producto'})
        // Mostramos los errores
        console.log(err)
    }
}

export {
    mostrarProductos,
    buscarProducto,
    registrarProducto,
    actualizarProducto,
    borrarProducto
}