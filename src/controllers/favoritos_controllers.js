const Favorito = require ('../models/favoritos.js')
const fs = require ('fs-extra')
const { deleteImage, uploadImage } = require ("../config/cloudinary.js")
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
    // Desestructuramos el objeto req.body
    // Extraemos las propiedades nombre, cantidad, precio, descripcion y categoria en variables separadas 
    const { nombre, cantidad, precio, descripcion, categoria, imagen } = req.body
    try {
        // Buscamos si el nombre del Favorito ya se encuentra registrado
        const exisNombre = await Favorito.findOne({ nombre })
        // En caso de ya estar registrado enviamos un mensaje
        if(exisNombre) return res.json({ message : 'Ya existe un Favorito con ese nombre'})
        // Colocamos condicionales para evitar que se ingresen numeros negativos
        // En caso de que la cantidad sea menor a 1 y el precio menor a 0 enviamos un mensaje
        if (cantidad < 0 && precio <= 0) return res.json({ message: 'La cantidad debe ser mayor a 1 y el precio debe ser mayor a 0' });
        // En caso de que la cantidad sea menor a 1 enviamos un mensaje
        else if (cantidad <= 0 ) return res.json({ message : 'La cantidad debe de ser mayor a 1'})
        // En caso de que el precio menor a 0 enviamos un mensaje
        else if (precio <= 0) return res.json ({ message : 'El precio debe de ser mayor a 0'})
        // Creamos una nueva instancia 
        const nuevoFavorito = new Favorito({
            // Genera un nuevo ID para el Favorito
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
            nuevoFavorito.imagen = {
                // Asignamos el public_id de la imagen cargada a la propiedad public_id
                public_id: imageUpload.public_id, 
                // Asignamos la secure_url de la imagen cargada a la propiedad secure_url
                secure_url: imageUpload.secure_url 
            };
            // Eliminamos el archivo temporal de la imagen utilizando el módulo fs
            await fs.unlink(req.files.image.tempFilePath); 
        }
        // Guardamos el nuevo Favorito en la base de datos
        await nuevoFavorito.save(); 
        // Enviamos un mensaje de Favorito Registrado y los detalles del Favorito registrado
        res.status(200).json({ message: 'Favorito Registrado', Favorito: nuevoFavorito }); 
    }catch (err){
        // Enviamos un mensaje de error en caso de que no se pueda registrar el Favorito
        res.status(500).json({ message : 'Error al registrar el Favorito'})
        // Mostramos los errores
        console.log(err)
    }
}

const borrarFavorito = async (req, res) => {
    // Obtenemos el valor de id de la URL
    const FavoritoId = req.params.id;
    try {
        // Buscamos en la base de datos ese Favorito y lo eliminamos
        let FavoritoEliminado = await Favorito.findById(FavoritoId);
        if (!FavoritoEliminado) {
            return res.status(404).json({ message: 'No se encontró el Favorito para borrar' });
        }
        if (FavoritoEliminado.imagen.length != undefined) {
            // Eliminamos la imagen del Favorito
            await deleteImage(FavoritoEliminado.imagen.public_id);
        }
        // Eliminamos el Favorito de la base de datos
        await Favorito.findByIdAndDelete(FavoritoId);
        // Enviamos un mensaje indicando que se borró el Favorito
        res.status(200).json({ message: 'Favorito borrado' });
    } catch (err) {
        // Enviamos un mensaje de error en caso de que no se pueda borrar el Favorito
        res.status(500).json({ message: 'Error al borrar el Favorito' });
        // Mostramos los errores
        console.log(err);
    }
};

module.exports = {
    mostrarFavoritos,
    buscarFavorito,
    registrarFavorito,
    borrarFavorito
}