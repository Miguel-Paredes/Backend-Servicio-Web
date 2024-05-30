// Importamos el modelo Cajero
const Cajero = require('../models/cajero.js');
// Importamos el modelo Registro
const Registro = require('../models/login.js');

// Metodo para proteger los pedidos realizados
const verificadoEmpleados = async (req, res, next) => {
  const cliente = req.body.cliente
  // Buscamos en el la bdd si el administrador inicio sesion o no
  const sesionAdmin = await Registro.findOne({ id : cliente })
  // Buscamos en el la bdd si el administrador inicio sesion o no
  const sesionCajero = await Cajero.findOne({ id : cliente })
  // Si existe un inicio de sesion del administrador
  if( (sesionAdmin.inicioSesion == true && sesionAdmin.admin == true) || sesionCajero.inicioSesion == true ){
    // Continuar
    return next();
  }else{
    // Redirecconamiento
    res.redirect(`${process.env.URL}/login`);
  }
}

// Exportamos la proteccion de los pedidos realizados
module.exports = verificadoEmpleados