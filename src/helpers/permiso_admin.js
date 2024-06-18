// Importamos el modelo Registro
const Registro = require('../models/login.js');

// Metodo para proteger las rutas del administrador
const verificadoAdministrador = async (req, res, next) => {
  // Definimos sesion
  let sesion = ''
  // Extraemos el id del cliente del body
  const clientebody = req.body.cliente
  // En caso de que no exista enviamos un mensaje
  if(!clientebody || clientebody.length === 0) {console.log('No hay id cliente en el body')}
  // Si existe lo buscamos en la bdd
  else{
    // Buscamos en el la bdd si el administrador inicio sesion o no
    sesion = await Registro.findOne({ _id : clientebody })
  }
  // Extraemos el id del cliente del query
  const clientequery = req.query.cliente
  // En caso de que no exista enviamos un mensaje
  if(!clientequery || clientequery.length === 0) {console.log('No hay id cliente en el query')}
  // Si existe lo buscamos en la bdd
  else{
    // Buscamos en el la bdd si el administrador inicio sesion o no
    sesion = await Registro.findOne({ _id : clientequery })
  }
  if(!sesion || sesion.length === 0) return res.redirect(`${process.env.URL}/login`);
  // Si existe un inicio de sesion del administrador
  if(sesion.inicioSesion == true && sesion.admin == true){
    // Continuar
    return next();
  }else{
    // Redirecconamiento
    res.redirect(`${process.env.URL}/login`);
  }
}

// Exportamos la proteccion de las rutas del administrador
module.exports = verificadoAdministrador