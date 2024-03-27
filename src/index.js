// Importaciones
    // Importamos la funcion connection del archivo database.js
    const connection = require("./database.js");
    // Importamos la variable app del archivo server.js
    const app = require("./server.js");

// Hacemos el uso de la funcion connection
connection()

// Alzamos el servidor
app.listen(app.get('port'), () => {
    console.log(`Servidor activo en el puerto ${app.get('port')}`)
})