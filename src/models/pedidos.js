// Importamos mongoose
const mongoose = require('mongoose')

// Creamos el modelo para mongo con los campos que se van a utilizar
const pedidoSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    // TODO
    cliente : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Registro",
        required : true
    },
    // TODO
    nombre:{ type : String, required : true, trim : true },
    producto : [{
        type : mongoose.Schema.Types.String,
        ref : "Producto",
        required : true,
        index : false
    }],
    cantidad : [{ type : Number, require : true, trim : true }],
    precio : [{ type : Number, require : true, trim : true }],
    // TODO
    comision : { type : Boolean, require : true, default : false },
    // TODO
    total : { type : Number, require : true, trim : true },
    fecha: { type: Date, default: () => Date.now() - 5 * 60 * 60 * 1000, required: true },
    estado : { type : String, require : true, enum : [ 'En espera', 'En preparación', 'Enviado', 'Pagado' ], default : 'En espera' }
}); 

// Exportamos el modelo
module.exports = mongoose.model('Pedido', pedidoSchema);