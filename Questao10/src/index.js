const express = require('express');
const jogosRouter = require('./routes/jogos');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) =>{
    res.json({
        mensagem: 'API de gerenciamento de Jogos'
    });
})

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use('/jogos', jogosRouter);

app.use((req, res) => {
    return res.status(404).json({
        erro: 'Rota não encontrada.'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});