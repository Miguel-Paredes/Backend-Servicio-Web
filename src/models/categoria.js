// Importamos mongoose
const mongoose = require('mongoose')

// Creamos el modelo para mongo con los campos que se van a utilizar
const categoriaSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    categoria : { type : String, require : true, unique : true, trim : true}
})

// Middleware pre-save para convertir los valores a mayúsculas
categoriaSchema.pre('save', function (next) {
    this.categoria = this.categoria.toUpperCase();
    next();
});

module.exports = mongoose.model('Categoria', categoriaSchema)