// Creamos un arreglo
const verificado = []

// Metodo para proteger las rutas
const verificadoAutentication = (req, res, next) => {
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

module.exports = {
  verificadoAutentication,
  verificado
}