// Importamos mongoose
const mongoose = require('mongoose')

// Creamos el modelo para mongo con los campos que se van a utilizar
const pedidoSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    cliente : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Registro",
        required : true
    },
    producto : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Producto",
        required : true,
        index : false
    }],
    cantidad : [{ type : Number, require : true, trim : true }],
    precio : [{ type : Number, require : true, trim : true }],
    comision : { type : Boolean, require : true, default : false },
    total : { type : Number, require : true, trim : true }
}); 

// Exportamos el modelo
module.exports = mongoose.model('Pedido', pedidoSchema);