
require("dotenv").config();
const express = require("express");
const conn = require("./db/conn");
const Jogo = require("./models/Jogo");
const handlebars = require("express-handlebars");
const { json } = require("express/lib/response");
const Usuario = require("./models/Usuario");
const Cartao = require("./models/Cartao");
const Conquista = require("./models/Conquista")

Jogo.belongsToMany(Usuario, { through: "aquisicoes" });
Usuario.belongsToMany(Jogo, { through: "aquisicoes" });

const app = express();


app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")


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
  res.send("Usuário inserido sob o id " + usuario.id);
});

app.get("/jogo/novo", (req, res) => {
  res.render(`formJogo`);
});

app.get("/usuarios/novo", (req, res) => {
  res.render(`formUsuario`);
});


app.get("/", (req, res) => {
  res.render(`home`);
});

app.get("/usuarios", async (req, res) => {
  const usuarios = await Usuario.findAll({ raw: true });
  res.render("usuarios", { usuarios })
})

app.get("/usuarios/:id/update", async (req, res) => {
  const id = req.params.id
  const usuario = await Usuario.findByPk(id, { raw: true })
  res.render("formUsuario", { usuario },) ;
})


app.post("/usuarios/:id/update", async (req, res) => {
  const id = parseInt(req.params.id);

  const dadosUsuario = {
    nickname: req.body.nickname,
    nome: req.body.nome
  }

  const retorno  = await Usuario.update(dadosUsuario, { where: { id: id } });

  if (retorno > 0) {
    res.redirect("/usuarios");
  } else {
    res.send("Erro ao atualizar usuário");
  }
});

app.get('/jogos/:id/conquistas', async (req, res) => {
  const id = parseInt(req.params.id)
  const jogo = await Jogo.findByPk(id, { include: ["Conquista"] });

  let conquistas = jogo.Conquista;
  conquistas = conquistas.map((conquista) => conquista.toJSON())


  res.render("Conquista.handlebars", { jogo: jogo.toJSON(), conquistas });
});

app.get("/jogos/:id/novaConquista", async (req, res) => {
  const id = parseInt(req.params.id);
  const jogo = await Jogo.findByPk(id, { raw: true });

  res.render("formConquista", { jogo });
});

app.post("/jogos/:id/novaConquista", async (req, res) => {
  const id = parseInt(req.params.id);

  const dadosConquista = {
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    JogoId: id,
  };

  await Conquista.create(dadosConquista);

  res.redirect(`/jogos/${id}/conquistas`);
});

app.get("/usuarios/:id/novoCartao", async (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = await Usuario.findByPk(id, { raw: true });

  res.render("formCartao", { usuario });
});

app.post("/usuarios/:id/novoCartao", async (req, res) => {
  const id = parseInt(req.params.id);

  const dadosCartao = {
    numero: req.body.numero,
    nome: req.body.nome,
    codSeguranca: req.body.codSeguranca,
    UsuarioId: id,
  };

  await Cartao.create(dadosCartao);

  res.redirect(`/usuarios/${id}/cartoes`);
});

// Inicialização do servidor
app.listen(8000, () => {
  console.log("Online");
  console.log("http://localhost:8000/")
});

// Conexão com o banco de dados
conn
  .sync()
  .then(() => {
    console.log("Conectado ao banco de dados com sucesso!");
  })
  .catch((err) => {
    console.log("Ocorreu um erro: " + err);
  });