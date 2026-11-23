// ===== Sessão =====
const usuarioLogado = localStorage.getItem("usuarioLogado");

if (!usuarioLogado) {
    window.location.href = "../Login/login.html";
} else {
    const usuario = JSON.parse(usuarioLogado);
    document.getElementById("nome-usuario").textContent = usuario.nome;
    document.getElementById("usuario-avatar").textContent =
        usuario.nome.charAt(0).toUpperCase();
}

document.getElementById("btn-sair").addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "../Login/login.html";
});

// ===== Elementos =====
const listaJogos = document.getElementById("lista-jogos");
const formBusca = document.getElementById("form-busca");
const campoBuscaId = document.getElementById("busca-id");
const mensagemBusca = document.getElementById("mensagem-busca");

const modal = document.getElementById("modal");
const formJogo = document.getElementById("form-jogo");
const campoJogoId = document.getElementById("jogo-id");
const modalTitulo = document.getElementById("modal-titulo");
const btnSalvar = document.getElementById("btn-salvar");

// ===== Renderização =====
function criarCard(jogo) {
    const card = document.createElement("article");
    card.className = "card card-jogo";

    const titulo = document.createElement("h2");
    titulo.textContent = jogo.titulo;

    const id = document.createElement("p");
    id.textContent = `ID: ${jogo.id}`;

    const ano = document.createElement("p");
    ano.textContent = `Ano: ${jogo.anoLancamento}`;

    const genero = document.createElement("p");
    genero.textContent = `Gênero: ${jogo.genero}`;

    const plataforma = document.createElement("p");
    plataforma.textContent = `Plataforma: ${jogo.plataforma}`;

    const acoes = document.createElement("div");
    acoes.className = "acoes";

    const btnEditar = document.createElement("button");
    btnEditar.type = "button";
    btnEditar.className = "btn-editar";
    btnEditar.textContent = "Editar";
    btnEditar.addEventListener("click", () => abrirModalEdicao(jogo));

    const btnExcluir = document.createElement("button");
    btnExcluir.type = "button";
    btnExcluir.className = "btn-excluir";
    btnExcluir.textContent = "Excluir";
    btnExcluir.addEventListener("click", () => excluirJogo(jogo));

    acoes.append(btnEditar, btnExcluir);
    card.append(titulo, id, ano, genero, plataforma, acoes);
    return card;
}

function renderizarJogos(jogos) {
    listaJogos.querySelectorAll(".card-jogo").forEach((c) => c.remove());
    jogos.forEach((jogo) => listaJogos.appendChild(criarCard(jogo)));
}

// ===== Busca =====
async function buscarJogos() {
    mensagemBusca.textContent = "";

    try {
        const resposta = await fetch("/jogos");

        if (!resposta.ok) {
            throw new Error(`Status ${resposta.status}`);
        }

        const jogos = await resposta.json();
        renderizarJogos(jogos);

        if (jogos.length === 0) {
            mensagemBusca.textContent = "Nenhum jogo cadastrado ainda.";
        }
    } catch (erro) {
        console.error(erro);
        mensagemBusca.textContent = "Erro ao carregar os jogos. O servidor está rodando?";
    }
}

async function buscarJogoPorId(id) {
    mensagemBusca.textContent = "";

    try {
        const resposta = await fetch(`/jogos/${id}`);

        if (resposta.status === 404) {
            renderizarJogos([]);
            mensagemBusca.textContent = `Nenhum jogo encontrado com o ID ${id}.`;
            return;
        }

        if (!resposta.ok) {
            throw new Error(`Status ${resposta.status}`);
        }

        const jogo = await resposta.json();
        renderizarJogos([jogo]);
        mensagemBusca.textContent = `Exibindo o jogo de ID ${id}.`;
    } catch (erro) {
        console.error(erro);
        mensagemBusca.textContent = "Erro ao buscar o jogo. O servidor está rodando?";
    }
}

// Recarrega respeitando a busca ativa (se houver ID digitado)
function recarregar() {
    const id = Number(campoBuscaId.value.trim());

    if (campoBuscaId.value.trim() !== "" && Number.isInteger(id) && id >= 1) {
        buscarJogoPorId(id);
    } else {
        buscarJogos();
    }
}

formBusca.addEventListener("submit", (event) => {
    event.preventDefault();

    const valor = campoBuscaId.value.trim();

    if (valor === "") {
        buscarJogos();
        return;
    }

    const id = Number(valor);

    if (!Number.isInteger(id) || id < 1) {
        mensagemBusca.textContent = "Digite um ID válido (número inteiro maior que zero).";
        return;
    }

    buscarJogoPorId(id);
});

document.getElementById("btn-limpar-busca").addEventListener("click", () => {
    campoBuscaId.value = "";
    buscarJogos();
});

// ===== Modal =====
function abrirModalNovo() {
    formJogo.reset();
    campoJogoId.value = "";
    modalTitulo.textContent = "Adicionar jogo";
    btnSalvar.textContent = "Cadastrar";
    modal.showModal();
}

function abrirModalEdicao(jogo) {
    formJogo.reset();
    campoJogoId.value = jogo.id;
    document.getElementById("titulo").value = jogo.titulo;
    document.getElementById("ano").value = jogo.anoLancamento;
    document.getElementById("genero").value = jogo.genero;
    document.getElementById("plataforma").value = jogo.plataforma;

    modalTitulo.textContent = `Editar jogo #${jogo.id}`;
    btnSalvar.textContent = "Salvar alterações";
    modal.showModal();
}

// ===== POST (cadastrar) e PUT (editar) =====
async function salvarJogo() {
    if (!formJogo.reportValidity()) {
        return;
    }

    const id = campoJogoId.value;
    const editando = id !== "";

    const jogo = {
        titulo: document.getElementById("titulo").value.trim(),
        plataforma: document.getElementById("plataforma").value.trim(),
        genero: document.getElementById("genero").value.trim(),
        anoLancamento: Number(document.getElementById("ano").value)
    };

    try {
        const resposta = await fetch(editando ? `/jogos/${id}` : "/jogos", {
            method: editando ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jogo)
        });

        if (resposta.status === 404) {
            alert("Esse jogo não existe mais.");
            modal.close();
            recarregar();
            return;
        }

        if (!resposta.ok) {
            alert(editando ? "Erro ao atualizar jogo!" : "Erro ao cadastrar jogo!");
            return;
        }

        alert(editando ? "Jogo atualizado com sucesso!" : "Jogo cadastrado com sucesso!");
        formJogo.reset();
        modal.close();
        recarregar();
    } catch (erro) {
        console.error(erro);
        alert("Não foi possível conectar ao servidor.");
    }
}

// ===== DELETE (excluir) =====
async function excluirJogo(jogo) {
    const confirmou = confirm(`Excluir o jogo "${jogo.titulo}" (ID ${jogo.id})?`);

    if (!confirmou) {
        return;
    }

    try {
        const resposta = await fetch(`/jogos/${jogo.id}`, { method: "DELETE" });

        // O servidor responde 204 (sem corpo), então não se usa resposta.json()
        if (resposta.status !== 204 && resposta.status !== 404) {
            alert("Erro ao excluir jogo!");
            return;
        }

        recarregar();
    } catch (erro) {
        console.error(erro);
        alert("Não foi possível conectar ao servidor.");
    }
}

// ===== Início =====
buscarJogos();