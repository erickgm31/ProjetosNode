
function ValidarEntrada(req, res, next) {
    const { titulo, plataforma, genero, anoLancamento } = req.body || {};
    const anoAtual = new Date().getFullYear();

    if (
        typeof titulo !== 'string' || titulo.trim() === '' ||
        typeof plataforma !== 'string' || plataforma.trim() === '' ||
        typeof genero !== 'string' || genero.trim() === '' ||
        typeof anoLancamento !== 'number' ||
        !Number.isInteger(anoLancamento) ||
        anoLancamento <= 0 ||
        anoLancamento > anoAtual
    ) {
        return res.status(400).json({
            erro: 'Digite dados válidos.'
        });
    }

    next();
}

module.exports = ValidarEntrada;
