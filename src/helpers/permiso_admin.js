// Creamos una variable 
let sesion = false

// Creamos una funcion que verifica si el administrador inicio sesion o no
const verifAdministrador = (inicioAdministrador) => {
  sesion = inicioAdministrador
}

// Metodo para proteger las rutas del administrador
const verificadoAdministrador = (req, res, next) => {
  // Si existe un inicio de sesion del administrador
  if(sesion  == true){
    // Continuar
    return next();
  }else{
    // Redirecconamiento
    res.redirect(`${process.env.URL}/login`);
  }
}

// Exportamos la proteccion de las rutas del administrador
module.exports = {
  verificadoAdministrador,
  verifAdministrador
}