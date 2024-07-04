
require("dotenv").config();
const express = require("express");
const conn = require("./db/conn");
const Jogo = require("./models/Jogo");
const handlebars = require("express-handlebars");
const Usuario = require("./models/Usuario");
const Cartao = require("./models/Cartao");
const Conquista = require("./models/Conquista")
const { DataTypes } = require("sequelize");


const app = express();

Jogo.belongsToMany(Usuario, { through: "aquisicoes" });
Usuario.belongsToMany(Jogo, { through: "aquisicoes" });


app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.post("/jogos/novo", async (req, res) => {
  const dadosJogo = {
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    precoBase: req.body.precoBase
  }

  const jogo = await Jogo.create(dadosJogo);
  res.send("Jogo cadastrado com id" + jogo.id);
});

app.get("/jogos", async (req, res) => {
  const jogos = await Jogo.findAll({ raw: true });
  res.render("jogos", { jogos });
});


app.post("/usuarios/novo", async (req, res) => {
  const dadosUsuario = {
    nickname: req.body.nickname,
    nome: req.body.nome
  }

  const usuario = await Usuario.create(dadosUsuario);
  res.send("Usuário inserido sob o id " + usuario.id);
});

app.get("/jogos/novo", (req, res) => {
  res.render("formJogo");
});

app.get("/usuarios/novo", (req, res) => {
  res.render("formUsuario");
});


app.get("/", (req, res) => {
  res.render("home");
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


app.post("/jogos/:id/update", async (req, res) => {
  const id = parseInt(req.params.id);

  const dadosJogo = {
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    precoBase: req.body.precoBase
  }

  const retorno  = await Jogo.update(dadosJogo, { where: { id: id } });

  if (retorno > 0) {
    res.redirect("/jogos");
  } else {
    res.send("Erro ao atualizar jogos");
  }
});

app.get("/jogos/:id/update", async (req, res) => {
  const id = req.params.id
  const jogo = await Jogo.findByPk(id, { raw: true })
  res.render("formJogo", { jogo },) ;
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


  res.render("conquista.handlebars", { jogo: jogo.toJSON(), conquistas });
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

app.get('/usuarios/:id/cartoes', async (req, res) => {
  const id = parseInt(req.params.id)
  const usuario = await Usuario.findByPk(id, { include: ["Cartaos"] });

  let cartoes = usuario.Cartaos;
  cartoes = cartoes.map((cartao) => cartao.toJSON())


  res.render("cartoes.handlebars", { usuario: usuario.toJSON(), cartoes });
});

app.post("/usuarios/:id/novocartao", async (req, res) => {
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

app.post("/usuarios/deletar", async (req, res) => {
  const id = req.body.id
  const retorno = await Usuario.destroy({ where: { id: id } });

  if (retorno > 0) {
    res.redirect("/usuarios");
  } else {
    res.send("Erro ao deletar usuário");
  }
});

app.post("/jogos/deletar", async (req, res) => {
  const id = req.body.id
  const retorno = await Jogo.destroy({ where: { id: id } });

  if (retorno > 0) {
    res.redirect("/jogos");
  } else {
    res.send("Erro ao deletar usuário");
  }
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