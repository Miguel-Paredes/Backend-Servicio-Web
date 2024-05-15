// Importamos mongoose
const mongoose = require("mongoose");

// Creamos el modelo para mongo con los campos que se van a utilizar
const productoSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    // TODO
    nombre : { type : String, required : true, unique : true, trim : true },
    precio : { type : Number, required : true, trim : true },
    cantidad : { type : Number, required : true},
    descripcion : { type : String, trim : true },
    categoria : { 
      type : mongoose.Schema.Types.String,
      ref : 'Categoria',
      require : true,
      trim : true
     },
    imagen : { public_id : String, secure_url : String}
    // TODO
});

// Middleware pre-save para convertir los valores a mayúsculas
productoSchema.pre('save', function (next) {
    this.nombre = this.nombre.toUpperCase();
    this.descripcion = this.descripcion.toUpperCase();
    this.categoria = this.categoria.toUpperCase();
    next();
  });

// Exportamos el modelo
module.exports = mongoose.model("Producto", productoSchema);