// Importamos el modelo Registro
const Registro = require('../models/login.js');

// Metodo para proteger las rutas
const verificadoAutentication = async (req, res, next) => {
  const cliente = req.body.cliente
  // Buscamos en el arreglo si inicio sesion o no
  const sesion = await Registro.findOne({cliente})
  // Si existe un inicio de sesion
  if(sesion.inicioSesion == true && sesion.admin == false){
    // Continuar
    return next();
  }else{
    // Redirecconamiento
    res.redirect(`${process.env.URL}/login`);
  }
}

// Importamos la proteccion de las rutas y el arreglo
module.exports = verificadoAutentication