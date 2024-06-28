// Importamos mongoose
const mongoose = require('mongoose')

// Creamos el modelo para mongo con los campos que se van a utilizar
const CarritoSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    // TODO
    cliente : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Registro",
        required : true
    },
    idProducto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        require: true
    },
    imagen: { type: String, require: true },
    producto : {
        type : mongoose.Schema.Types.String,
        ref : "Producto",
        required : true,
        index : false
    },
    cantidad : { type : Number, require : true, trim : true },
    precio : { type : Number, require : true, trim : true }
    // TODO
}); 

// Exportamos el modelo
module.exports = mongoose.model('Carrito', CarritoSchema);