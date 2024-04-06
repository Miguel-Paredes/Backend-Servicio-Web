const inicioAdministrador = require('../controllers/login_controllers.js')

// Metodo para proteger las rutas
const verificadoAdministrador = (req, res, next) => {
  // Si existe un inicio de sesion del administrador
  if(inicioAdministrador  == true){
    // Continuar
    return next();
  }else{
    // Redirecconamiento
    res.redirect(`${process.env.URL}/login`);
  }
}

module.exports = {
  verificadoAdministrador
}