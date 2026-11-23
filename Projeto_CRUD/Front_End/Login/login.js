const formLogin = document.getElementById("form-login");
const campoUsuario = document.getElementById("usuario");
const campoSenha = document.getElementById("senha");
const mensagemErro = document.getElementById("erro-login");

formLogin.addEventListener("submit", async (event) => {
    event.preventDefault();

    const usuarioDigitado = campoUsuario.value.trim();
    const senhaDigitada = campoSenha.value;

    mensagemErro.textContent = "";

    let dados;

    try {
        const resposta = await fetch("./usuarios.json");

        if (!resposta.ok) {
            throw new Error(`Falha ao carregar usuarios.json (status ${resposta.status})`);
        }

        dados = await resposta.json();
    } catch (erro) {
        console.error(erro);
        mensagemErro.textContent =
            "Não foi possível carregar os usuários. Abra o site por http://localhost:3000.";
        return;
    }

    const usuarioEncontrado = dados.usuarios.find((u) =>
        u.usuario.toLowerCase() === usuarioDigitado.toLowerCase() &&
        u.senha === senhaDigitada
    );

    if (!usuarioEncontrado) {
        mensagemErro.textContent = "Usuário ou senha incorretos.";
        return;
    }

    localStorage.setItem("usuarioLogado", JSON.stringify({
        id: usuarioEncontrado.id,
        usuario: usuarioEncontrado.usuario,
        nome: usuarioEncontrado.nome
    }));

    window.location.href = "../Catalogo/catalogo.html";
});