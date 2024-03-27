// Importamos mongoose 
const mongoose = require("mongoose");

// Al colocar strictQuery permitimos que solo los campos defininos en el Schema
// se puedan almacenar en la base de datos
mongoose.set('strictQuery', true)

// Creamos una funcion llamada connection
const connection = async () => {
    try{
        // Establecemos una conexion con la base de datos
        const { connection } = await mongoose.connect(process.env.Base_de_Datos)
        // Indicamos en consola si se conecto exitosamente a la base de datos
        console.log(`Base de datos activa en ${connection.host} - ${connection.port}`)
    }catch (error){
        // En caso de que no se haya conectado exitosamente a la base de datos
        // Indicamos el error por el cual no se coneccto
        console.log(error)
    }
}

// Exportamos la funcion
module.exports = connection