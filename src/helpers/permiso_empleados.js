// Importamos el modelo Cajero
const Cajero = require('../models/cajero.js');
// Importamos el modelo Registro
const Registro = require('../models/login.js');

// Metodo para proteger los pedidos realizados
const verificadoEmpleados = async (req, res, next) => {
  // Definimos sesion
  let cliente = ''
  // Extraemos el id del cliente del body
  const clientebody = req.body.cliente
  // En caso de que no exista enviamos un mensaje
  if(!clientebody || clientebody.length === 0) {console.log('No hay id cliente en el body')}
  // Si existe lo buscamos en la bdd
  else{
    // Buscamos en el la bdd si el administrador inicio sesion o no
    cliente = await Registro.findOne({ _id : clientebody })
  }
  // Extraemos el id del cliente del query
  const clientequery = req.query.cliente
  // En caso de que no exista enviamos un mensaje
  if(!clientequery || clientequery.length === 0) {console.log('No hay id cliente en el query')}
  // Si existe lo buscamos en la bdd
  else{
    // Buscamos en el la bdd si el administrador inicio sesion o no
    cliente = await Registro.findOne({ _id : clientequery })
  }
  // Buscamos en el la bdd si el administrador inicio sesion o no
  const sesionAdmin = await Registro.findOne({ _id : cliente })
  // Buscamos en el la bdd si el administrador inicio sesion o no
  const sesionCajero = await Cajero.findOne({ _id : cliente })
  if( (sesionAdmin.length === 0 || !sesionAdmin) && (sesionCajero.length == 0 || !sesionCajero) ) return res.redirect(`${process.env.URL}/login`);
  // Si existe un inicio de sesion del administrador
  else if( (sesionAdmin.inicioSesion == true && sesionAdmin.admin == true) || sesionCajero.inicioSesion == true ){
    // Continuar
    return next();
  }else{
    // Redirecconamiento
    res.redirect(`${process.env.URL}/login`);
  }
}

// Exportamos la proteccion de los pedidos realizados
module.exports = verificadoEmpleados