// Importamos el modelo
const Categoria = require('../models/categoria.js');
// Importamos moongose
const mongoose = require ('mongoose')
// Importamos el controlador de favoritos para actualizar la categoria de los productos
const { actualizarCategoriaFavorito } = require('./favoritos_controllers.js');
// Importamos el controlador de productos para actualizar la categoria de los productos
const { actualizarCategoriaProducto } = require('./productos_controllers.js');

const mostrarCategorias = async (req, res) => {
    try {
        // Buscamos en la base de datos los Categorias
        const Categorias = await Categoria.find();
        // En caso de que no existan Categorias registrados, enviamos un mensaje
        if (!Categorias || Categorias.length === 0) return res.json({ message: 'No existen Categorias' });
        // Modificamos el nombre de cada Categoria para tener la primera inicial en mayúscula
        // y las demás en minúscula
        const listarCategorias = Categorias.map(Categoria => {
            const nombreCategoria = Categoria.categoria.charAt(0).toUpperCase() + Categoria.categoria.slice(1).toLowerCase();
            return { _id: Categoria.id, categoria: nombreCategoria };
        });
        // Mostramos todos los Categorias
        res.status(200).json(listarCategorias);
    } catch (err) {
        // Enviamos un mensaje de error en caso de que no se puedan obtener los Categorias
        res.status(500).json({ message: 'Error al obtener las Categorias' });
        // Mostramos los errores
        console.log(err);
    }
};

const buscarCategoria = async (req, res) => {
    // Obtenemos el valor de id de la url
    const CategoriaId = req.params.id
    try{
        // Buscamos en la base de datos ese Categoria
        const Categorias = await Categoria.find({ _id : CategoriaId })
        // En caso de que no exista ese Categoria enviamos un mensaje
        if (!Categorias || Categorias.length === 0) return res.json({ message: 'No existe esa Categoria' });
        // Modificamos el nombre del Categoria para tener la primera inicial en mayúscula y las demás en minúscula
        const listarCategorias = Categorias.map(Categoria => {
            const nombreCategoria = Categoria.categoria.charAt(0).toUpperCase() + Categoria.categoria.slice(1).toLowerCase();
            return { _id: Categoria.id, categoria: nombreCategoria };
        });
        // Mostramos el Categoria
        res.status(200).json(listarCategorias);
    }catch (err){
        // Enviamos un mensaje de error en caso de que no se puedan mostrar el Categoria
        res.status(500).json({ message : 'Error al obtener la Categoria'})
        // Mostramos los errores
        console.log(err)
    }
};

const registrarCategoria = async (req, res) => {
    // Desestructuramos el objeto req.body
    // Extraemos la propiedad categoria en una variable
    const categoria = req.body.categoria
    // Validar todos los campos llenos
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    try {
        // Buscamos si el nombre de la Categoria ya se encuentra registrado
        const exisNombre = await Categoria.findOne({ categoria })
        // En caso de ya estar registrado enviamos un mensaje
        if(exisNombre) return res.json({ message : 'Ya existe esa categoria'})
        // Creamos una nueva instancia 
        const nuevaCategoria = new Categoria({
            // Genera un nuevo ID para el Categoria
            _id : new mongoose.Types.ObjectId,
            // Asignamos el valor de la variable categoria a la propiedad categoria
            categoria : categoria
        });
        // Guardamos la nuevo Categoria en la base de datos
        await nuevaCategoria.save(); 
        // Enviamos un mensaje de Categoria Registrado y los detalles del Categoria registrado
        res.status(200).json({ message: 'Categoria Registrada', Categoria: nuevaCategoria }); 
    }catch (err){
        // Enviamos un mensaje de error en caso de que no se pueda registrar la Categoria
        res.status(500).json({ message : 'Error al registrar la Categoria'})
        // Mostramos los errores
        console.log(err)
    }
};

const actualizarCategoria = async (req, res) => {
    // Obtenemos el valor de id de la url
    const CategoriaId = req.params.id
    // Desestructuramos el objeto req.body
    // Extraemos la categoria en una variable
    let categoria = req.body.categoria
    categoria = categoria.toUpperCase()
    // Validar todos los campos llenos
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    try{
        let CategoriaActualizado = await Categoria.findById( CategoriaId )
        if(!CategoriaActualizado) return res.status(404).json({ message : 'No se encontro el Categoria para actualizar'})
        CategoriaActualizado = await Categoria.findByIdAndUpdate(
            CategoriaId,
            {
                categoria : categoria
            },
            { new : true}
        )
        // Guardamos el nuevo Categoria en la base de datos
        await CategoriaActualizado.save(); 
        // Llamamos al controlador actualizarCategoriaProducto y pasamos CategoriaId como argumento
        await actualizarCategoriaProducto(CategoriaId, categoria);
        // Llamamos al controlador actualizarCategoriaFavorito y pasamos CategoriaId como argumento
        await actualizarCategoriaFavorito(CategoriaId, categoria)
        // Enviamos un mensaje de Categoria Actualizado y los detalles del Categoria registrado
        res.status(200).json({ message: 'Categoria Actualizado', Categoria: CategoriaActualizado }); 
    }catch (err){
        // Enviamos un mensaje de error en caso de que no se pueda actualizar el Categoria
        res.status(500).json({ message : 'Error al actualizar la Categoria'})
        // Mostramos los errores
        console.log(err)
    }
};

const borrarCategoria = async (req, res) => {
    // Obtenemos el valor de id de la URL
    const CategoriaId = req.params.id;
    try {
        // Buscamos en la base de datos la categoria del Producto y la eliminamos
        let categoriaEliminado = await Categoria.findByIdAndDelete(CategoriaId);
        if (!categoriaEliminado) return res.status(404).json({ message: 'No se encontró la Categoria para borrar' });
        // Enviamos un mensaje indicando que se borró el Producto
        res.status(200).json({ message: 'Caregoria borrada' });
    } catch (err) {
        // Enviamos un mensaje de error en caso de que no se pueda borrar el Producto
        res.status(500).json({ message: 'Error al borrar la Categoria' });
        // Mostramos los errores
        console.log(err);
    }
};

module.exports = {
    mostrarCategorias,
    buscarCategoria,
    registrarCategoria,
    actualizarCategoria,
    borrarCategoria
}