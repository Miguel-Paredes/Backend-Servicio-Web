// Importamos el modelo Registro
const Registro = require('../models/login.js');
// Importamos el modelo de Cajero
const Cajero = require("../models/cajero");

// Metodo para proteger las rutas
const verificadoAutentication = async (req, res, next) => {
  const cliente = req.body.cliente
  // Buscamos en el la bdd si el cliente inicio sesion o no
  const sesion = await Registro.findOne({cliente})
  // Buscamos en el la bdd si el cajero inicio sesion o no
  const Cajeros = await Cajero.findOne({cliente})
  // Si existe un inicio de sesion
  if((sesion.inicioSesion == true && sesion.admin == false) || (Cajeros.inicioSesion == true)){
    // Continuar
    return next();
  }else{
    // Redirecconamiento
    res.redirect(`${process.env.URL}/login`);
  }
}

// Importamos la proteccion de las rutas y el arreglo
module.exports = verificadoAutentication