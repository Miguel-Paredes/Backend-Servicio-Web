// Importamos mongoose
const mongoose = require('mongoose')

// Creamos el modelo para mongo con los campos que se van a utilizar
const carritoCajeroSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    // TODO
    cliente : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Cajero",
        required : true
    },
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
module.exports = mongoose.model('CarritoCajero', carritoCajeroSchema);