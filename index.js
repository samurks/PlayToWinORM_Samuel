require("dotenv").config();
const conn = require("./db/conn")

const Usuario = require("./models/Usuario")

conn
.sync()
.then( () => {
    console.log("Conectado e sincronizado com o banco de dados!");
}).catch( (err)=>{
    console.log("Ocorreu um erro: " + err)
} );



//conn.authenticate()
//.then( () => {
//    console.log("Conectado ao banco de dados com sucesso!");
//}).catch( (err)=>{
//    console.log("Ocorreu um erro: " + err)
//} );