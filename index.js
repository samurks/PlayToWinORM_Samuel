require("dotenv").config();
const express = require("express");
const conn = require("./db/conn");
const Jogo = require("./models/Jogo");
const handlebars = require("express-handlebars");
const { json } = require("express/lib/response");
const Usuario = require("./models/Usuario");

const app = express();

app.engine("handlebars", handlebars.engine())
app.set ("view engine", "handlebars")

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/jogo/novo", async (req, res) => {
  const dadosJogo = {
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    precoBase: req.body.precoBase
  }

  const jogo = await Jogo.create(dadosJogo);
  res.send("Jogo cadastrado com id" + jogo.id);
});
app.post("/usuario/novo", async (req, res) => {
    const dadosUsuario = {
      nickname: req.body.nickname,
      nome: req.body.nome
    }
  
    const usuario = await Usuario.create(dadosUsuario);
    res.send("Jogo cadastrado com id" + usuario.id);
  });
  
  app.get("/jogo/novo", (req, res) => {
    res.render(`formJogo`);
  });
  
  app.get("/usuario/novo", (req, res) => {
    res.render(`formUsuario`);
  });
  
  
  app.get("/", (req, res) => {
    res.render(`home`);
  });
  
  app.get("/usuarios", (req, res) => {
    res.render(`usuarios`);
  });
  
  app.listen(8000, () => {
    console.log("Abridu!");
  });
  
  conn
    .sync()
    .then(() => {
      console.log("Conectado ao banco de dados com sucesso!");
    })
    .catch((err) => {
      console.log("Ocorreu um erro: " + err);
    });