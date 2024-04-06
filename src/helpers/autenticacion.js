// Creamos un arreglo
const verificado = []

// Metodo para proteger las rutas
const verificadoAutentication = (req, res, next) => {
  // Buscamos en el arreglo si inicio sesion o no
  const sesion = verificado.find( cliente => cliente === req.body.cliente)
  // Si existe un inicio de sesion
  if(sesion){
    // Continuar
    return next();
  }else{
    // Redirecconamiento
    res.redirect(`${process.env.URL}/login`);
  }
}

// Importamos la proteccion de las rutas y el arreglo
module.exports = {
  verificadoAutentication,
  verificado
}