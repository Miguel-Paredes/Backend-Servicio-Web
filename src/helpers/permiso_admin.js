// Importamos el modelo Registro
const Registro = require('../models/login.js');

// Metodo para proteger las rutas del administrador
const verificadoAdministrador = async (req, res, next) => {
  const cliente = req.body.cliente
  // Buscamos en el la bdd si el administrador inicio sesion o no
  const sesion = await Registro.findOne({ id : cliente })
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