// Importamos el modelo Registro
const Registro = require('../models/login.js');

// Metodo para proteger las rutas del administrador
const verificadoAdministrador = async (req, res, next) => {
  let sesion = ''
  const clientebody = req.body.cliente
  if(!clientebody || clientebody.length === 0) {console.log('No hay id cliente en el body')}
  else{
    // Buscamos en el la bdd si el administrador inicio sesion o no
    sesion = await Registro.findOne({ _id : clientebody })
  }
  const clientequery = req.query.cliente
  if(!clientequery || clientequery.length === 0) {console.log('No hay id cliente en el query')}
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