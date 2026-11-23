const express = require("express");
const db = require("./database");

const app = express();
app.use(express.json());

const path = require("path");

// Serve o front-end (login, catálogo, imagens)
app.use(express.static(path.join(__dirname, "..", "Front_End")));

// Abrir http://localhost:3000 leva direto ao login
app.get("/", (req, res) => {
  res.redirect("/Login/login.html");
});

// GET - Listar jogos
app.get("/jogos", (req, res) => {
  const jogos = db.prepare(
    "SELECT * FROM jogos"
  ).all();

  res.json(jogos);
});

// GET - Buscar jogo por ID
app.get("/jogos/:id", (req, res) => {
  const jogo = db.prepare(
    "SELECT * FROM jogos WHERE id = ?"
  ).get(req.params.id);

  if (!jogo) {
    return res.status(404).json({
      erro: "Jogo não encontrado"
    });
  }

  res.json(jogo);
});

// POST - Cadastrar jogo
app.post("/jogos", (req, res) => {
  const { titulo, plataforma, genero, anoLancamento } = req.body;

  if (!titulo || !plataforma || !genero ||
      !Number.isInteger(anoLancamento)) {
    return res.status(400).json({
      erro: "Dados inválidos ou incompletos"
    });
  }

  const resultado = db.prepare(`
    INSERT INTO jogos
    (titulo, plataforma, genero, anoLancamento)
    VALUES (?, ?, ?, ?)
  `).run(titulo, plataforma, genero, anoLancamento);

  res.status(201).json({
    id: Number(resultado.lastInsertRowid),
    titulo,
    plataforma,
    genero,
    anoLancamento
  });
});

// PUT - Atualizar jogo
app.put("/jogos/:id", (req, res) => {
  const { titulo, plataforma, genero, anoLancamento } = req.body;

  if (!titulo || !plataforma || !genero ||
      !Number.isInteger(anoLancamento)) {
    return res.status(400).json({
      erro: "Dados inválidos ou incompletos"
    });
  }

  const resultado = db.prepare(`
    UPDATE jogos
    SET titulo = ?, plataforma = ?,
        genero = ?, anoLancamento = ?
    WHERE id = ?
  `).run(titulo, plataforma, genero, anoLancamento, req.params.id);

  if (resultado.changes === 0) {
    return res.status(404).json({
      erro: "Jogo não encontrado"
    });
  }

  res.json({ mensagem: "Jogo atualizado" });
});

// DELETE - Remover jogo
app.delete("/jogos/:id", (req, res) => {
  const resultado = db.prepare(
    "DELETE FROM jogos WHERE id = ?"
  ).run(req.params.id);

  if (resultado.changes === 0) {
    return res.status(404).json({
      erro: "Jogo não encontrado"
    });
  }

  res.status(204).send();
});

app.listen(3000, () => {
  console.log("Servidor iniciado na porta 3000");
});
