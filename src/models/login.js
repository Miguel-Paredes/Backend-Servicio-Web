// Importamos bcrypt
const bcrypt = require('bcrypt');
// Importamos moongose
const mongoose = require('mongoose');

// Especificamos el número de rondas de generación de salt
const saltRounds = 10;

// Creamos el modelo para mongo con los campos que se van a utilizar
const RegistroSchema = new mongoose.Schema({
  username : { type : String, required : true },
  password : { type : String, required : true },
  email : { type : String, require  : true, unique  : true},
  telefono : { type : Number, require : true, unique : true },
  token : { type : String, default : null },
  confirmEmail : { type : Boolean, default : false },
  admin : { type : Boolean, default : false },
  inicioSesion : { type : Boolean, default : false }
});


// Encriptar la contraseña antes de guardar en el mongo
RegistroSchema.pre('save', function (next) {
  // Verifica si el documento es nuevo o si el campo 'password' ha sido modificado
  if (this.isNew || this.isModified('password')) {
    const document = this;
    // Genera un hash del campo 'password' utilizando bcrypt
    bcrypt.hash(document.password, saltRounds, (err, hashedPassword) => {
      if (err) {
        // Si ocurre un error al generar el hash, pasa el error al siguiente middleware
        next(err);
      } else {
        // Asigna el hash generado al campo 'password' del documento
        document.password = hashedPassword;
        // Continúa con el siguiente middleware
        next();
      }
    });
  } else {
    // Si el documento no es nuevo y el campo 'password' no ha sido modificado, continúa con el siguiente middleware
    next();
  }
});

// Verificar la contraseña al momento de hacer login
RegistroSchema.methods.isCorrectPassword = async function (password) {
  try {
    // Compara la contraseña proporcionada con el hash almacenado en el campo password
    return await bcrypt.compare(String(password), this.password);
  } catch (error) {
    throw new Error(error);
  }
};

RegistroSchema.methods.crearToken = function () {
    // Genera un token aleatorio utilizando Math.random() y lo asigna al campo token
    const tokenGenerado = this.token = Math.random().toString(36).slice(2);
    // Retorna el token generado
    return tokenGenerado;
}

// Exportamos el modelo
module.exports = mongoose.model('Registro', RegistroSchema);