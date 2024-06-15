// Importamos el modelo Registro
const Registro = require('../models/login.js');
// Importamos sendMailToUser-sendMailToRecoveryPassword para poder enviar los respectivos correos
const { sendMailToUser, sendMailToRecoveryPassword } = require('../config/nodemailer.js');

const inicioLogin = async (req, res) => {
  // Desestructuramos el objeto req.body
  // Extraemos las propiedades email y password en variables separadas 
  const { email, password } = req.body;
  // Validar todos los campos llenos
  if (Object.values(req.body).includes('')) return res.status(400).json({msg:'Lo sentimos, debes llenar todos los campos'})
  try {
    // Buscamos el correo en la base de datos
    const user = await Registro.findOne({ email });
    // Verificamos si existe el usuario
    if(!user) return res.status(404).json({msg:'Lo sentimos, el usuario no se encuentra registrado'})
    // Verificamos si ya confirmo la cuenta
    if(user?.confirmEmail===false) return res.status(403).json({msg:'Lo sentimos, debe verificar su cuenta'})
    // En caso de que el administrador ya haya iniciado sesion
    if(user.inicioSesion == true && user.admin == true) return res.json({ message : 'El administrador ya inicio sesion'})
    // En caso de que haya iniciado sesion enviamos un mensaje
    else if(user.inicioSesion == true) return res.json({ message : 'El usuario ya inicio sesión'})
    else{
      // Desincriptamos la contraseña
      const contra = await user.isCorrectPassword(password)
      // Creamos condicionales para verificar el el correo y la contraseña
      // En caso de que el usuario y la contraseña sean incorrectos indicamos enviamos un mensaje
      if (!user && !contra) return res.status(500).json({ message : 'Correo y/o contraseña incorrectos'})
      // En caso de que el usuario sea incorrecto indicamos enviamos un mensaje
      else if (!user) return res.status(500).json({ message : 'Correo incorrecto'})
      // En caso de que la contraseña sea incorrecta indicamos enviamos un mensaje
      else if (!contra) return res.status(500).json({ message : 'Contraseña incorrecto'})
      // En caso de que todo este en orden enviamos un mensaje
      else {
        // Actualizamos el campo de inicio de sesion en true
        await Registro.findByIdAndUpdate(user._id, {inicioSesion : true}, { new : true})
        // Enviamos un mensaje de que se autentico el usuario
        res.status(200).json({ message: 'Usuario Autenticado Correctamente', userId: user._id });
      }
    }
  } catch (err) {
    // Enviamos un mensaje de error en caso de que no se pueda autenticar el usuario
    res.status(500).send('Error al autenticar el usuario');
    // Mostramos los errores
    console.log(err);
  }
};

const registroLogin = async (req, res) => {
  // Desestructuramos el objeto req.body
  // Extraemos la propiedad email y telefono variables separadas
  const { email, telefono } = req.body;
  try {
    // Validar todos los campos llenos
    if (Object.values(req.body).includes('')) return res.status(400).json({msg:'Lo sentimos, debes llenar todos los campos'})
    // Buscamos el correo en la base de datos
    const exisCorreo = await Registro.findOne({ email })
    // Buscamos el correo en la base de datos
    const exisTelefono = await Registro.findOne({ telefono })
    // En caso de que exista el correo enviamos un mensaje
    if(exisCorreo) return res.status(400).json({ msg:'Lo sentimos, el email ya se encuentra registrado' })
    // En caso de que exista el telefono enviamos un mensaje
    if(exisTelefono) return res.status(400).json({ msg:'Lo sentimos, el telefono celular ya se encuentra registrado' })
    // Creamos una nueva instancia
    const user = new Registro(req.body);
    // Creamos un token
    const token = await user.crearToken()
    // Invocar la función para el envío de correo 
    await sendMailToUser(email,token)
    // Guardamos el nuevo Usuario en la base de datos
    await user.save();
    // Enviamos un mensaje que verifique su correo, si todo esta en orden
    res.status(200).json({ message: 'Revisa tu correo electrónico para confirmar tu cuenta' });
  } catch (err) {
    // Enviamos un mensaje de error en caso de que no se pueda registrar el usuario
    res.status(500).json({ error: 'Error al registrar el usuario' });
    // Mostramos los errores
    console.log(err);
  }
};

const confirmEmail = async (req, res) => {
  // Verifica si no se proporcionó un token en los parámetros de la solicitud
  if (!(req.params.token)) return res.status(400).json({ msg: 'Lo sentimos, no se puede validar la cuenta' });
  // Busca en la base de datos un registro con el token proporcionado
  const user = await Registro.findOne({ token: req.params.token });
  // Verifica si el usuario no existe o si el campo token no está definido
  if (!user?.token) return res.status(404).json({ msg: 'La cuenta ya ha sido confirmada' });
  // Establece el campo token en null para indicar que el token ha sido utilizado
  user.token = null;
  // Establece el campo confirmEmail en true para indicar que la cuenta ha sido confirmada
  user.confirmEmail = true;
  // Guarda los cambios realizados en el objeto user en la base de datos
  await user.save();
  // Enviamos una respuesta de éxito con un mensaje indicando que el token ha sido confirmado
  res.status(200).json({ msg: 'Token confirmado, ya puedes iniciar sesión' });
};

const recuperarPassword = async (req, res) => {
  // Extrae el valor del campo email de la solicitud
  const { email } = req.body;
  // Verifica si algún campo de la solicitud está vacío
  if (Object.values(req.body).includes('')) return res.status(404).json({ msg: 'Lo sentimos, debes llenar todos los campos' });
  // Busca en la base de datos el correo
  const user = await Registro.findOne({ email });
  // Verifica si no se encontró ningún usuario con el correo 
  if (!user) return res.status(404).json({ msg: 'Lo sentimos, el usuario no se encuentra registrado' });
  // Crea un token para la recuperación de contraseña
  const token = user.crearToken();
  // Asigna el token generado al campo token del usuario
  user.token = token;
  // Envía un correo electrónico para la recuperación de contraseña
  await sendMailToRecoveryPassword(email, token);
  // Guarda los cambios realizados en el objeto user en la base de datos
  await user.save();
  // Enviamos una respuesta de éxito con un mensaje indicando que se debe revisar el correo electrónico
  res.status(200).json({ msg: 'Revisa tu correo electrónico para restablecer tu cuenta' });
};

const comprobarTokenPasword = async (req, res) => {
  // Verifica si no se proporcionó un token en los parámetros de la solicitud
  if (!(req.params.token)) return res.status(404).json({ msg: 'Lo sentimos, no se puede validar la cuenta' });
  // Busca en la base de datos un registro con el token proporcionado
  const user = await Registro.findOne({ token: req.params.token });
  // Verifica si el usuario no existe o si el campo token no coincide con el token proporcionado
  if (user?.token !== req.params.token) return res.status(404).json({ msg: 'Lo sentimos, no se puede validar la cuenta' });
  // Guarda los cambios realizados en el objeto user en la base de datos
  await user.save();
  // Enviamos una respuesta de éxito con un mensaje indicando que el token ha sido confirmado
  res.status(200).json({ msg: 'Token confirmado, ya puedes crear tu nuevo password' });
};

const nuevoPassword = async (req, res) => {
  // Extrae los valores de los campos password y confirmpassword de la solicitud
  const { password, confirmpassword } = req.body;
  // Verifica si algún campo de la solicitud está vacío
  if (Object.values(req.body).includes('')) return res.status(404).json({ msg: 'Lo sentimos, debes llenar todos los campos' });
  // Verifica si los campos password y confirmpassword no coinciden
  if (password != confirmpassword) return res.status(404).json({ msg: 'Lo sentimos, los passwords no coinciden' });
  // Busca en la base de datos un registro con el token proporcionado
  const user = await Registro.findOne({ token: req.params.token });
  // Verifica si el usuario no existe o si el campo token no coincide con el token proporcionado
  if (user?.token !== req.params.token) return res.status(404).json({ msg: 'Lo sentimos, no se puede validar la cuenta' });
  // Establece el campo token en null para indicar que el token ha sido utilizado
  user.token = null;
  // Guardamos la nueva contraseña
  user.password = password
  // Guarda los cambios realizados en el objeto user en la base de datos
  await user.save();
  // Enviamos una respuesta de éxito con un mensaje indicando que el password ha sido actualizado
  res.status(200).json({ msg: 'Felicitaciones, ya puedes iniciar sesión con tu nuevo password' });
};

const administrador = async (req, res) => {
  // Creamos las credenciales para el administrador
  const nombre = 'Administrador';
  const apellido = 'Minimarket';
  const password = 'Minimarket2024';
  const direccion = ''
  const email = process.env.EMAIL_ADMINISTRADOR;
  const telefono = process.env.CELULAR_ADMINISTRADOR;
  const confirmEmail = true;
  const admin = true;
  try {
    // Buscamos si ya hay el usuario del administrador
    const buscarUsername = await Registro.find({ email : email });
    // En caso de que no este creada le creamos
    if (buscarUsername.length === 0) {
      const user = new Registro({ nombre, apellido, direccion, password, email, confirmEmail, admin, telefono });
      await user.save();
    }
    const clientes = await Registro.find()
    for (i = 0 ; i < clientes.length ; i++){
      await Registro.findByIdAndUpdate(clientes[i], { inicioSesion : false }, { new : true })
    }
    const Cajero = require("../models/cajero");
    const cajeros = await Cajero.find()
    for (i = 0 ; i < cajeros.length ; i++){
      await Cajero.findByIdAndUpdate(cajeros[i], { inicioSesion : false }, { new : true })
    }
  } catch (error) {
    // Indicamos si hay un error al crear al usuario del administrador
    console.log('Error al crear el usuario del administrador', error);
  }
};

const cierreSesionLogin = async (req, res) => {
  // Almacenamos el email del usuario para poder cerrar sesión
  const email = req.body.email;
  try {
    // Buscamos el correo en la base de datos
    const user = await Registro.findOne({ email });
    // Verificamos si iniciaron sesion
    if(user.inicioSesion == false) return res.json({ message : 'Ese usuario no inicio sesion'})
    // Cerramos la sesion
    await Registro.findByIdAndUpdate(user._id, {inicioSesion : false}, { new : true})
    // Redireccionamos al login
    res.redirect(`${process.env.URL}/login`);
  } catch (err) {
    // En caso de haber un error, indicamos que no se pudo cerrar la sesión del usuario
    res.status(500).json({ message: 'Error al cerrar la sesión del usuario' });
    // Mostramos el error
    console.log(err);
  }
};

// Exportamos los controladores
module.exports = {
    inicioLogin,
    registroLogin,
    confirmEmail,
    recuperarPassword,
    comprobarTokenPasword,
    nuevoPassword,
    administrador,
    cierreSesionLogin
};