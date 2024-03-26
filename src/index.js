// Importaciones
    // Importamos la funcion connection del archivo database.js
    import connection from "./database.js";
    // Importamos la variable app del archivo server.js
    import app from "./server.js";

// Hacemos el uso de la funcion connection
connection()

// Alzamos el servidor
app.listen(app.get('port'), () => {
    console.log(`Servidor activo en el puerto ${app.get('port')}`)
})