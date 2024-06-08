const connection = require("./src/database.js");
const app = require("./src/server.js");

connection()

app.listen(app.get('port'),()=>{
    console.log(`Server ok on http://localhost:${app.get('port')}`);
})