import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    nombre : { type : String, required : true, unique : true, trim : true },
    cantidad : { type : Number, required : true, trim : true },
    precio : { type : Number, required : true, trim : true },
    descripcion : { type : String, trim : true },
    categoria : { type : String, trim : true },
    disponible : { type : Boolean, default : true, trim : true },
    imagen : { public_id : String, secure_url : String}
});

// Middleware pre-save para convertir los valores a mayúsculas
productoSchema.pre('save', function (next) {
    this.nombre = this.nombre.toUpperCase();
    this.descripcion = this.descripcion.toUpperCase();
    this.categoria = this.categoria.toUpperCase();
    next();
  });

export default mongoose.model("Producto", productoSchema);