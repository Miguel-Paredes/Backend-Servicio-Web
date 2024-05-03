// Importa las funciones check y validationResult desde el módulo express-validator
const { check, validationResult } = require('express-validator');

const validacion = [
  // Validación para los campos 'username', 'email' y 'password'
  check(["username", "email", "password"])
    .exists()
    .withMessage('Los campos "username", "email" y/o "password" son obligatorios')
    .notEmpty()
    .withMessage('Los campos "username", "email" y/o "password" no pueden estar vacíos')
    .customSanitizer(value => value?.trim()),
  // Validación para el campo 'username'
  check("username")
    .isLength({ min: 3, max: 20 })
    .withMessage('El campo "username" debe tener entre 3 y 20 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El campo "username" debe contener solo letras y espacios')
    .customSanitizer(value => value?.trim()),
  // Validación para el campo 'email'
  check("email")
    .isEmail()
    .withMessage('El campo "email" no es correcto')
    .customSanitizer(value => value?.trim()),
  // Validación para el campo 'password'
  check("password")
    .isLength({ min: 5 })
    .withMessage('El campo "password" debe tener al menos 5 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*).*$/)
    .withMessage('El campo "password" debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial')
    .customSanitizer(value => value?.trim()),
  // Validacion para el campo 'telefono'
  check("telefono")
    .isLength({ min: 10 })
    .withMessage('El campo "teléfono" debe tener al menos 10 digitos')
    .isNumeric()
    .withMessage('El campo "teléfono" debe contener solo números')
    .custom(value => {
      if (value.startsWith("09") && value.length === 10) {
        return true;
      } else {
        throw new Error('El campo "teléfono" debe comenzar con "09" y tener una longitud de 10 números');
      }
    }),
  // Middleware para verificar si hay errores de validación
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    } else {
      return res.status(400).send({ errors: errors.array() });
    }
  }
];

// Exportamos la validacion
module.exports = validacion;