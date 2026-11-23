const {DatabaseSync} = require("node:sqlite");

const db = new DatabaseSync("jogos.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS jogos(
         id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        plataforma TEXT NOT NULL,
        genero TEXT NOT NULL,
        anoLancamento INTEGER NOT NULL
    )
`);

module.exports = db;