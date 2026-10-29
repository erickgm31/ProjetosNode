class Jogo {

    constructor(id, titulo, plataforma, genero, anoLancamento) {
        this.id = id;
        this.titulo = titulo;
        this.plataforma = plataforma;
        this.genero = genero;
        this.anoLancamento = anoLancamento;
    }

    setTitulo(titulo) {
        this.titulo = titulo;
    }

    setPlataforma(plataforma) {
        this.plataforma = plataforma;
    }

    setGenero(genero) {
        this.genero = genero;
    }

    setAnoLancamento(anoLancamento) {
        this.anoLancamento = anoLancamento;
    }

}

module.exports = Jogo;