const mongoose = require("mongoose");

const favoritoSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    producto : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Producto",
        required : true
    }
    // Cuando se agregue la logica de Clientes
    // clientes : [{
    //     type : mongoose.Schema.Types.ObjectId,
    //     ref : "Cliente"
    // }]
});

// Copiamos los campos del modelo Producto en el modelo Favorito
favoritoSchema.add({
    nombre : {
        type : String,
        required : true,
        trim : true,
        index : false 
    },
    precio : {
        type : Number,
        required : true,
        trim : true
    },
    descripcion : {
        type : String,
        trim : true
    },
    categoria : {
        type : String,
        trim : true
    },
    imagen : {
        public_id : String,
        secure_url : String
    }
});

// Middleware pre-save para convertir los valores a mayúsculas
favoritoSchema.pre('save', function (next) {
    this.nombre = this.nombre.toUpperCase();
    this.descripcion = this.descripcion.toUpperCase();
    this.categoria = this.categoria.toUpperCase();
    next();
  });

module.exports = mongoose.model("Favorito", favoritoSchema);