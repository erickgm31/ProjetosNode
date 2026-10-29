const express = require('express');
const router = express.Router();

const ValidarEntrada = require('../middlewares/validarEntrada.js');
const repositorio = require('../repositores/jogosRepositores.js');
const Jogo = require('../entities/Jogo.js');

let proximoId = 0;



router.get('/', (req, res) =>{
    return res.status(200).json(repositorio.jogos);
}); 

router.get('/:id', (req, res) =>{
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 0) {
        return res.status(400).json({
            erro: 'O ID deve ser um número inteiro positivo.'
        });
    }

    const jogo = repositorio.jogos.find(jogo => jogo.id === id);

    if (!jogo) {
        return res.status(404).json({
            erro: 'Jogo não encontrado.'
        }); 
    }

    res.status(200).json(jogo);
});

router.post('/', ValidarEntrada,(req, res) => {

    const jogo = new Jogo(
        proximoId++,
        req.body.titulo.trim(),
        req.body.plataforma.trim(),
        req.body.genero.trim(),
        Number(req.body.anoLancamento)
    )

    repositorio.jogos.push(jogo);

    res.status(201).json(jogo);
});

router.put('/:id', ValidarEntrada, (req, res) =>{
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 0) {
        return res.status(400).json({
            erro: 'O ID deve ser um número inteiro positivo.'
        });
    }

    const jogo = repositorio.jogos.find(jogo => jogo.id === id);

    if (!jogo) {
        return res.status(404).json({
            erro: 'Jogo não encontrado.'
        }); 
    }

    jogo.setTitulo(req.body.titulo.trim());
    jogo.setPlataforma(req.body.plataforma.trim());
    jogo.setGenero(req.body.genero.trim());
    jogo.setAnoLancamento(Number(req.body.anoLancamento));

    res.status(200).json(jogo);
});

router.delete('/:id', (req, res) =>{
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 0) {
        return res.status(400).json({
            erro: 'O ID deve ser um número inteiro positivo.'
        });
    }

    const indice = repositorio.jogos.findIndex(jogo => jogo.id === id);

    if(indice === -1){
        return res.status(404).json({
            erro: 'Jogo não encontrado'
        });
    }

    repositorio.jogos.splice(indice, 1); 

    return res.status(204).send();
});

module.exports = router;