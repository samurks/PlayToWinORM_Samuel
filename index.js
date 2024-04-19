require("dotenv").config();
const conn = require("./db/conn");

const Usuario = require("./models/Usuario");

const express = require("express");
const app = express();

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());

app.get("/usuarios/novo", (req, res)=>{
res.sendFile(`${__dirname}/views/formusuario.html`);
});

app.post("/usuarios/novo", async (req, res)=>{
const dadosUsuario = {
    nickname: req.body.nickname,
    };

    const usuario = await Usuario.create(dadosUsuario)
    res.send("Usuario Inserido sob o id" + usuario.id)
});

app.listen(8000, ()=>{
    console.log("Server Rodando")
})

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