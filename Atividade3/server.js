const express = require('express');

const app = express();
const port = 3000;

app.use(express.json());

class Aluno {
    constructor(id, nome, curso) {
        this.id = id;
        this.nome = nome;
        this.curso = curso;
    }

    setNome(nome) {
        this.nome = nome;
    }

    setCurso(curso) {
        this.curso = curso;
    }

    apresentar() {
        console.log(`${this.id}, ${this.nome}, ${this.curso}`);
    }
}

// Dados iniciais
const alunos = [
    new Aluno(1, 'Ana', 'Computação'),
    new Aluno(2, 'Pedro', 'Sistemas de Informação')
];

// Próximo ID disponível
let proximoId = 3;

// CREATE - Cadastrar aluno
app.post('/alunos', validarAluno, (req, res) => {
    const { nome, curso } = req.body || {};

    if (
        typeof nome !== 'string' || !nome.trim() ||
        typeof curso !== 'string' || !curso.trim()
    ) {
        return res.status(400).json({
            mensagem: 'Nome e curso são obrigatórios!'
        });
    }

    const aluno = new Aluno(
        proximoId++,
        nome.trim(),
        curso.trim()
    );

    alunos.push(aluno);

    return res.status(201).json({
        mensagem: 'Aluno cadastrado com sucesso!',
        dados: aluno
    });
});

// READ - Listar todos os alunos
app.get('/alunos', (req, res) => {
    return res.status(200).json(alunos);
});

// READ - Consultar aluno por ID
app.get('/alunos/:id', (req, res) => {
    const idAluno = Number(req.params.id);

    const alunoEncontrado = alunos.find(
        aluno => aluno.id === idAluno
    );

    if (!alunoEncontrado) {
        return res.status(404).json({
            mensagem: 'Aluno não encontrado!'
        });
    }

    return res.status(200).json(alunoEncontrado);
});

// UPDATE - Atualizar aluno
app.put('/alunos/:id', (req, res) => {
    const idAluno = Number(req.params.id);

    const alunoEncontrado = alunos.find(
        aluno => aluno.id === idAluno
    );

    if (!alunoEncontrado) {
        return res.status(404).json({
            mensagem: 'Aluno não encontrado!'
        });
    }

    const { nome, curso } = req.body;

    if (
        typeof nome !== 'string' || !nome.trim() ||
        typeof curso !== 'string' || !curso.trim()
    ) {
        return res.status(400).json({
            mensagem: 'Nome e curso são obrigatórios!'
        });
    }

    alunoEncontrado.setNome(nome.trim());
    alunoEncontrado.setCurso(curso.trim());

    return res.status(200).json({
        mensagem: 'Aluno atualizado com sucesso!',
        dados: alunoEncontrado
    });
});

// DELETE - Excluir aluno
app.delete('/alunos/:id', (req, res) => {
    const idAluno = Number(req.params.id);

    const indice = alunos.findIndex(
        aluno => aluno.id === idAluno
    );

    if (indice === -1) {
        return res.status(404).json({
            mensagem: 'Aluno não encontrado!'
        });
    }

    alunos.splice(indice, 1);

    return res.status(204).send();
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
