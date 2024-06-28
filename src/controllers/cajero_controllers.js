// Importamos el modelo de Cajero
const Cajero = require("../models/cajero");
// Importamos el modelo Registro
const Registro = require('../models/login.js');

const inicioCajero = async (req, res, next) => {
  // Desestructuramos el objeto req.body
  // Extraemos las propiedades email y password en variables separadas 
  const { email, password } = req.body;
  // Validar todos los campos llenos
  if (Object.values(req.body).includes('')) return res.json({msg:'Lo sentimos, debes llenar todos los campos'})
  try {
    // Buscamos el correo en la base de datos
    const user = await Cajero.findOne({ email });
    if(!user || user.length === 0) return next();
    // En caso de que el cajero ya haya iniciado sesion
    if(user.inicioSesion == true) return res.json({ message : 'El Cajero ya inicio sesion',userId : user._id})
    // Desincriptamos la contraseña
    const contra = await user.isCorrectPassword(password)
    // En caso de que el usuario y la contraseña sean incorrectos indicamos enviamos un mensaje
    if (!user && !contra) return res.status(500).json({ message : 'Correo y/o contraseña incorrectos'})
    // En caso de que el usuario sea incorrecto indicamos enviamos un mensaje
    else if (!user) return res.status(500).json({ message : 'Correo incorrecto'})
    // En caso de que la contraseña sea incorrecta indicamos enviamos un mensaje
    else if (!contra) return res.status(500).json({ message : 'Contraseña incorrecto'})
    // En caso de que todo este en orden enviamos un mensaje
    else{
        // Actualizamos el campo de inicio de sesion en true
        await Cajero.findByIdAndUpdate(user._id, {inicioSesion : true}, { new : true})
        // Enviamos un mensaje de que se autentico el usuario
        res.status(200).json({ message : 'Cajero Autenticado Correctamente', userId : user._id });
    }
  }catch(err){
    // Enviamos un mensaje de error en caso de que no se puedo autenticar el Cajero
    res.json({ message : 'Error al autenticar Cajero'})
    // Mostramos los errores
    console.log(err)
  }
}

const crearCajero = async (req, res) => {
  // Desestructuramos el objeto req.body
  // Extraemos la propiedad email y telefono variables separadas
  const { email, telefono } = req.body
  try {
    // Validar todos los campos llenos
    if (Object.values(req.body).includes('')) return res.json({msg:'Lo sentimos, debes llenar todos los campos'})
    // Buscamos el correo en la base de datos del cajero
    const exisCorreo = await Cajero.findOne({ email })
    // Buscamos el correo en la base de datos del cajero
    const exisTelefono = await Cajero.findOne({ telefono })
    // En caso de que exista el correo enviamos un mensaje
    if(exisCorreo) return res.json({ msg:'Lo sentimos, el email ya se encuentra registrado en los cajeros' })
    // En caso de que exista el telefono enviamos un mensaje
    if(exisTelefono) return res.json({ msg:'Lo sentimos, el telefono celular ya se encuentra registrado en los cajeros' })
    // Buscamos el correo en la base de datos de cliente
    const exisCorreoCliente = await Registro.findOne({ email })
    // Buscamos el correo en la base de datos de cliente
    const exisTelefonoCliente = await Registro.findOne({ telefono })
    // En caso de que exista el correo enviamos un mensaje
    if(exisCorreoCliente) return res.json({ msg:'Lo sentimos, ese email ya se encuentra registrado en los clientes' })
    // En caso de que exista el telefono enviamos un mensaje
    if(exisTelefonoCliente) return res.json({ msg:'Lo sentimos, el telefono celular ya se encuentra registrado en los clientes' })
    // Creamos una nueva instancia
    const user = new Cajero(req.body);
    // Guardamos el nuevo Usuario en la base de datos
    await user.save();
    // Enviamos un mensaje que verifique su correo, si todo esta en orden
    res.status(200).json({ message: 'Cajero creado', Cajero : user });
  }catch(err){
    // Enviamos un mensaje de error en caso de que no se puedo crear el Cajero
    res.json({ message : 'Error al crear el Cajero' })
    // Mostramos los errores
    console.log(err)
  }
}

const actualizarCajero = async (req, res) => {
    // Desestructuramos el objeto req.body
    // Extraemos la propiedad email una variable
    const id = req.params.id
    try {
        // Validar todos los campos llenos
        if (Object.values(req.body).includes('')) return res.json({msg:'Lo sentimos, debes llenar todos los campos'})
        // Buscamos el correo en la base de datos
        const exisCorreo = await Cajero.findOne({ _id : id })
        if(!exisCorreo || exisCorreo.length === 0) {
            // Si no existe ese cajero enviamos un mensaje 
            res.json({ message : 'No existe ese Cajero' })
        }else{
            await Cajero.findByIdAndUpdate(id, req.body, { new : true })
            exisCorreo.password = req.body.password
            await exisCorreo.save()
            res.json({ message : 'Cajero Actualizado', Cajero : exisCorreo })
        }
    }catch(err){
        // Enviamos un mensaje de error en caso de que no se puedo actualizar el Cajero
        res.json({ message : 'Error al actualizar Cajero' })
        // Mostramos los errores
        console.log(err)
    }
}

const borrarCajero = async (req, res) => {
    // Desestructuramos el objeto req.body
    // Extraemos la propiedad email una variable
    const email = req.params.id
    console.log(email)
    try {
        // Buscamos el correo en la base de datos
        const exisCorreo = await Cajero.findOne({ _id : email })
        if(exisCorreo.length === 0 || !exisCorreo) {
            // Si no existe ese cajero enviamos un mensaje 
            res.json({ message : 'No existe ese Cajero' })
        }else{
            // Si existe eliminamos y enviamos un mensaje
            await Cajero.findByIdAndDelete(exisCorreo._id)
            res.json({ message : 'Cajero Borrado' })
        }
    }catch(err){
        // Enviamos un mensaje de error en caso de que no se puedo borrar el Cajero
        res.json({ message : 'Error al actualizar Cajero' })
        // Mostramos los errores
        console.log(err)
    }
}

const mostrarCajeros = async (req, res) => {
    try {
        // Buscamos en la base de datos los Cajeros
        const Cajeros = await Cajero.find()
        // En caso de que no existan Cajeros registrados, enviamos un mensaje
        if (!Cajeros || Cajeros.length === 0) return res.json({ message: 'No existen Cajeros' });
        // Mostramos todos los Cajeros
        res.status(200).json(Cajeros);
    }catch(err){
        // Enviamos un mensaje de error en caso de que no se puedo mostrar los Cajeros
        res.json({ message : 'Error al mostrar los Cajeros' })
        // Mostramos los errores
        console.log(err)
    }
}

const buscarCajero = async (req, res) => {
    const id = req.params.id
    try {
        // Buscamos en la base de datos los Cajeros
        const Cajeros = await Cajero.findOne({ id })
        // En caso de que no existan Cajeros registrados, enviamos un mensaje
        if (!Cajeros || Cajeros.length === 0) return res.json({ message: 'No existe ese Cajero' });
        // Mostramos todos los Cajeros
        res.status(200).json(Cajeros);
    }catch(err){
        // Enviamos un mensaje de error en caso de que no se puedo buscar el Cajero
        res.json({ message : 'Error al buscar el Cajero' })
        // Mostramos los errores
        console.log(err)
    }
}

const cierreSesionCajero = async (req, res, next) => {
    // Desestructuramos el objeto req.body
    // Extraemos la propiedad email en una variable
    const cliente = req.query.cliente;
    // Validar todos los campos llenos
    if (Object.values(req.body).includes('')) return res.json({msg:'Lo sentimos, debes llenar todos los campos'})
    try {
      // Buscamos el correo en la base de datos
      const user = await Cajero.findOne({ _id : cliente });
      if(!user || user.length === 0) return next();
      // En caso de que el cajero ya haya iniciado sesion
      else if(user.inicioSesion == false) return res.json({ message : 'El Cajero no inicio sesion'})
      // En caso de que el usuario sea incorrecto indicamos enviamos un mensaje
      else if (!user) return res.status(500).json({ message : 'Correo incorrecto'})
      // En caso de que todo este en orden enviamos un mensaje
      else{
          // Actualizamos el campo de inicio de sesion en true
          user.inicioSesion = false
          user.save()
          // Enviamos un mensaje de que se cerro la sesion del usuario
          res.json({ message : 'Adios'})
      }
    }catch(err){
      // Enviamos un mensaje de error en caso de que no se puedo autenticar el Cajero
      res.json({ message : 'Error al autenticar Cajero'})
      // Mostramos los errores
      console.log(err)
    }
  }

module.exports = {
    inicioCajero,
    crearCajero,
    actualizarCajero,
    borrarCajero,
    mostrarCajeros,
    buscarCajero,
    cierreSesionCajero
}