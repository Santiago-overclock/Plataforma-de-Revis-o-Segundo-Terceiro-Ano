// ======================================================
// REVISÃO DE ESTUDOS SESI
// SCRIPT PRINCIPAL
// ======================================================


// ======================================================
// ABAS
// ======================================================

function mostrarAba(id, botao) {

    const paineis = document.querySelectorAll(".painel");
    const botoes = document.querySelectorAll(".aba");

    paineis.forEach(painel => {
        painel.classList.remove("ativo");
    });

    botoes.forEach(btn => {
        btn.classList.remove("ativo");
    });

    const painelSelecionado = document.getElementById(id);

    if (painelSelecionado) {
        painelSelecionado.classList.add("ativo");
    }

    if (botao) {
        botao.classList.add("ativo");
    }
}


// ======================================================
// CAMINHO DA PÁGINA
// ======================================================

function obterCaminhoPagina() {

    let caminho = window.location.pathname;

    caminho = caminho.replace(/\\/g, "/");

    const marcador = "/pages/areas/";

    const posicao = caminho.indexOf(marcador);

    if (posicao !== -1) {
        return caminho.substring(posicao);
    }

    return caminho;
}


// ======================================================
// QUIZ
// ======================================================

function obterChaveQuiz() {

    return "quiz_" + obterCaminhoPagina();
}


function salvarResultadoQuiz(pontos, total) {

    const chave = obterChaveQuiz();

    const resultado = {

        pontos: pontos,

        total: total,

        porcentagem: Math.round(
            (pontos / total) * 100
        ),

        data: new Date().toLocaleString("pt-BR")
    };


    localStorage.setItem(
        chave,
        JSON.stringify(resultado)
    );


    // Histórico geral

    let historico =
        JSON.parse(
            localStorage.getItem("historicoQuizzes")
        ) || [];


    const materia = obterNomeMateria();


    historico.push({

        materia: materia,

        caminho: obterCaminhoPagina(),

        pontos: pontos,

        total: total,

        porcentagem: resultado.porcentagem,

        data: resultado.data
    });


    // Mantém os últimos 30

    if (historico.length > 30) {

        historico =
            historico.slice(-30);
    }


    localStorage.setItem(
        "historicoQuizzes",
        JSON.stringify(historico)
    );
}


function obterNomeMateria() {

    const titulo =
        document.querySelector("h1");

    if (titulo) {

        return titulo.textContent

            .replace("📚", "")
            .replace("📘", "")
            .replace("📕", "")
            .replace("📖", "")

            .trim();
    }

    return "Matéria";
}


function exibirResultado() {

    const questoes =
        document.querySelectorAll(".questao");


    // Aceita os dois IDs para evitar problemas

    let resultado =
        document.getElementById(
            "resultado-final-quiz"
        );


    if (!resultado) {

        resultado =
            document.getElementById("resultado");
    }


    if (
        !resultado ||
        questoes.length === 0
    ) {

        return;
    }


    let pontos = 0;

    let respondidas = 0;


    questoes.forEach(questao => {

        const marcada =
            questao.querySelector(
                'input[type="radio"]:checked'
            );


        if (marcada) {

            respondidas++;


            // Resposta correta = value 1

            if (marcada.value === "1") {

                pontos++;
            }
        }
    });


    // ==================================================
    // QUIZ INCOMPLETO
    // ==================================================

    if (
        respondidas <
        questoes.length
    ) {

        resultado.className =
            "resultado incompleto";


        resultado.innerHTML = `

            <h3>⚠️ Quiz incompleto</h3>

            <p>
                Você respondeu
                ${respondidas}
                de
                ${questoes.length}
                questões.
            </p>

            <p>
                Responda todas as questões
                antes de finalizar.
            </p>
        `;


        return;
    }


    // ==================================================
    // RESULTADO
    // ==================================================

    const total =
        questoes.length;


    const porcentagem =
        Math.round(
            (pontos / total) * 100
        );


    salvarResultadoQuiz(
        pontos,
        total
    );


    let mensagem = "";


    if (porcentagem === 100) {

        mensagem =
            "🏆 Excelente! Você acertou todas!";
    }

    else if (porcentagem >= 80) {

        mensagem =
            "🌟 Muito bom! Você teve um ótimo desempenho.";
    }

    else if (porcentagem >= 60) {

        mensagem =
            "👍 Bom trabalho! Continue revisando.";
    }

    else {

        mensagem =
            "📚 Continue estudando e tente novamente.";
    }


    resultado.className =
        "resultado";


    resultado.innerHTML = `

        <h3>Resultado do Quiz</h3>

        <div class="nota-quiz">
            ${pontos}/${total}
        </div>

        <p>
            <strong>
                ${porcentagem}%
                de aproveitamento
            </strong>
        </p>

        <p>
            ${mensagem}
        </p>

        <div class="barra-quiz">

            <div
                style="width: ${porcentagem}%">
            </div>

        </div>
    `;


    mostrarConclusao();
}


// ======================================================
// CHECKLIST
// ======================================================

function obterChaveChecklist() {

    return "checklist_" +
        obterCaminhoPagina();
}


function atualizarProgresso() {

    const checklist =
        document.querySelectorAll(
            '#checklist input[type="checkbox"]'
        );


    if (checklist.length === 0) {

        return;
    }


    const marcados =
        document.querySelectorAll(
            '#checklist input[type="checkbox"]:checked'
        ).length;


    const porcentagem =
        Math.round(
            (marcados / checklist.length) * 100
        );


    const barra =
        document.getElementById(
            "barra-progresso"
        );


    if (barra) {

        barra.style.width =
            porcentagem + "%";
    }


    const texto =
        document.getElementById(
            "porcentagem-progresso"
        );


    if (texto) {

        texto.textContent =
            porcentagem + "%";
    }


    salvarChecklist();

    mostrarConclusao();
}


function atualizarProgressoSemSalvar() {

    const checklist =
        document.querySelectorAll(
            '#checklist input[type="checkbox"]'
        );


    if (checklist.length === 0) {

        return;
    }


    const marcados =
        document.querySelectorAll(
            '#checklist input[type="checkbox"]:checked'
        ).length;


    const porcentagem =
        Math.round(
            (marcados / checklist.length) * 100
        );


    const barra =
        document.getElementById(
            "barra-progresso"
        );


    if (barra) {

        barra.style.width =
            porcentagem + "%";
    }


    const texto =
        document.getElementById(
            "porcentagem-progresso"
        );


    if (texto) {

        texto.textContent =
            porcentagem + "%";
    }
}


function salvarChecklist() {

    const checklist =
        document.querySelectorAll(
            '#checklist input[type="checkbox"]'
        );


    if (checklist.length === 0) {

        return;
    }


    const estados = [];


    checklist.forEach(item => {

        estados.push(
            item.checked
        );
    });


    localStorage.setItem(

        obterChaveChecklist(),

        JSON.stringify(estados)
    );
}


function carregarChecklist() {

    const checklist =
        document.querySelectorAll(
            '#checklist input[type="checkbox"]'
        );


    if (checklist.length === 0) {

        return;
    }


    const dados =
        localStorage.getItem(
            obterChaveChecklist()
        );


    if (dados) {

        try {

            const estados =
                JSON.parse(dados);


            checklist.forEach(
                (item, index) => {

                    item.checked =
                        estados[index] || false;
                }
            );

        } catch (erro) {

            console.error(
                "Erro ao carregar checklist:",
                erro
            );
        }
    }


    atualizarProgressoSemSalvar();


    checklist.forEach(item => {

        item.addEventListener(
            "change",
            atualizarProgresso
        );

    });


    mostrarConclusao();
}


// ======================================================
// MENSAGEM DE CONCLUSÃO
// ======================================================

function mostrarConclusao() {

    const checklist =
        document.querySelectorAll(
            '#checklist input[type="checkbox"]'
        );


    if (checklist.length === 0) {

        return;
    }


    const marcados =
        document.querySelectorAll(
            '#checklist input[type="checkbox"]:checked'
        ).length;


    const existente =
        document.querySelector(
            ".mensagem-conclusao"
        );


    if (existente) {

        existente.remove();
    }


    if (
        marcados === checklist.length &&
        checklist.length > 0
    ) {

        const mensagem =
            document.createElement("div");


        mensagem.className =
            "mensagem-conclusao";


        mensagem.innerHTML = `

            <strong>
                🎉 Conteúdo concluído!
            </strong>

            <span>
                Você revisou todos os tópicos desta matéria.
            </span>
        `;


        const checklistElemento =
            document.getElementById(
                "checklist"
            );


        if (checklistElemento) {

            checklistElemento.appendChild(
                mensagem
            );
        }
    }
}


// ======================================================
// MODO ESCURO
// ======================================================

function alternarModoEscuro() {

    document.body.classList.toggle(
        "modo-escuro"
    );


    const ativado =
        document.body.classList.contains(
            "modo-escuro"
        );


    localStorage.setItem(

        "modoEscuro",

        ativado
            ? "true"
            : "false"
    );


    atualizarTextoModo();
}


function carregarModoEscuro() {

    const modo =
        localStorage.getItem(
            "modoEscuro"
        );


    if (modo === "true") {

        document.body.classList.add(
            "modo-escuro"
        );
    }


    atualizarTextoModo();
}


function atualizarTextoModo() {

    const botoes =
        document.querySelectorAll(
            ".botao-modo"
        );


    botoes.forEach(botao => {

        if (
            document.body.classList.contains(
                "modo-escuro"
            )
        ) {

            botao.textContent =
                "☀️ Modo claro";

        } else {

            botao.textContent =
                "🌙 Modo escuro";
        }

    });
}


// ======================================================
// PESQUISA
// ======================================================

function pesquisarConteudo() {

    const campo =
        document.getElementById(
            "campo-pesquisa"
        );


    if (!campo) {

        return;
    }


    const termo =
        campo.value
            .toLowerCase()
            .trim();


    const materias =
        document.querySelectorAll(
            ".dashboard-materia"
        );


    materias.forEach(materia => {

        const texto =
            materia.textContent
                .toLowerCase();


        if (
            texto.includes(termo)
        ) {

            materia.style.display = "";

        } else {

            materia.style.display =
                "none";
        }

    });
}


function configurarPesquisa() {

    const campo =
        document.getElementById(
            "campo-pesquisa"
        );


    if (campo) {

        campo.addEventListener(
            "input",
            pesquisarConteudo
        );
    }
}


// ======================================================
// PROGRESSO DAS MATÉRIAS
// ======================================================

function normalizarCaminho(caminho) {

    if (!caminho) {

        return "";
    }


    caminho =
        caminho.replace(
            /\\/g,
            "/"
        );


    const marcador =
        "/pages/areas/";


    const posicao =
        caminho.indexOf(marcador);


    if (posicao !== -1) {

        return caminho.substring(
            posicao
        );
    }


    return caminho;
}


function calcularProgressoMateria(caminho) {

    const caminhoNormalizado =
        normalizarCaminho(caminho);


    const chave =
        "checklist_" +
        caminhoNormalizado;


    const dados =
        localStorage.getItem(chave);


    if (!dados) {

        return 0;
    }


    try {

        const estados =
            JSON.parse(dados);


        if (
            !Array.isArray(estados) ||
            estados.length === 0
        ) {

            return 0;
        }


        const concluido =
            estados.filter(Boolean).length;


        return Math.round(
            (concluido / estados.length) *
            100
        );

    } catch (erro) {

        console.error(
            "Erro no progresso:",
            erro
        );


        return 0;
    }
}


function atualizarDashboard() {

    const materias =
        document.querySelectorAll(
            ".dashboard-materia[data-caminho]"
        );


    if (materias.length === 0) {

        return;
    }


    let soma = 0;


    materias.forEach(materia => {

        const caminho =
            materia.dataset.caminho;


        const progresso =
            calcularProgressoMateria(
                caminho
            );


        soma += progresso;


        const barra =
            materia.querySelector(
                ".barra-materia"
            );


        if (barra) {

            barra.style.width =
                progresso + "%";
        }


        const numero =
            materia.querySelector(
                ".numero-progresso"
            );


        if (numero) {

            numero.textContent =
                progresso + "%";
        }

    });


    const geral =
        Math.round(
            soma / materias.length
        );


    const barraGeral =
        document.getElementById(
            "barra-progresso-geral"
        );


    if (barraGeral) {

        barraGeral.style.width =
            geral + "%";
    }


    const numeroGeral =
        document.getElementById(
            "numero-progresso-geral"
        );


    if (numeroGeral) {

        numeroGeral.textContent =
            geral + "%";
    }
}


// ======================================================
// DADOS DO ALUNO
// ======================================================

function salvarNomeAluno() {

    const campo =
        document.getElementById(
            "nome-aluno"
        );


    if (!campo) {

        return;
    }


    const nome =
        campo.value.trim();


    if (nome) {

        localStorage.setItem(
            "nomeAluno",
            nome
        );
    }


    atualizarNomeAluno();
}


function atualizarNomeAluno() {

    const nomeSalvo =
        localStorage.getItem(
            "nomeAluno"
        ) || "Aluno";


    const elementos =
        document.querySelectorAll(
            ".nome-aluno"
        );


    elementos.forEach(elemento => {

        elemento.textContent =
            nomeSalvo;
    });


    const campo =
        document.getElementById(
            "nome-aluno"
        );


    if (
        campo &&
        !campo.value
    ) {

        campo.value =
            localStorage.getItem(
                "nomeAluno"
            ) || "";
    }
}


// ======================================================
// ESTATÍSTICAS
// ======================================================

function obterEstatisticas() {

    const historico =
        JSON.parse(
            localStorage.getItem(
                "historicoQuizzes"
            )
        ) || [];


    let questoes = 0;

    let melhor = 0;

    let soma = 0;


    historico.forEach(item => {

        questoes +=
            item.total || 0;


        if (
            (item.porcentagem || 0)
            > melhor
        ) {

            melhor =
                item.porcentagem;
        }


        soma +=
            item.porcentagem || 0;
    });


    const media =
        historico.length > 0

            ? Math.round(
                soma / historico.length
            )

            : 0;


    return {

        quizzes:
            historico.length,

        questoes:
            questoes,

        melhor:
            melhor,

        media:
            media
    };
}


function atualizarEstatisticas() {

    const estatisticas =
        obterEstatisticas();


    const quizzes =
        document.getElementById(
            "total-quizzes"
        );


    if (quizzes) {

        quizzes.textContent =
            estatisticas.quizzes;
    }


    const questoes =
        document.getElementById(
            "total-questoes"
        );


    if (questoes) {

        questoes.textContent =
            estatisticas.questoes;
    }


    const melhor =
        document.getElementById(
            "melhor-resultado"
        );


    if (melhor) {

        melhor.textContent =
            estatisticas.melhor +
            "%";
    }


    const media =
        document.getElementById(
            "media-resultados"
        );


    if (media) {

        media.textContent =
            estatisticas.media +
            "%";
    }
}


// ======================================================
// MATÉRIA COM MAIOR PROGRESSO
// ======================================================

function atualizarMelhorMateria() {

    const materias =
        document.querySelectorAll(
            ".dashboard-materia[data-caminho]"
        );


    if (materias.length === 0) {

        return;
    }


    let maior = -1;

    let nomeMaior =
        "Nenhuma ainda";


    materias.forEach(materia => {

        const numero =
            materia.querySelector(
                ".numero-progresso"
            );


        const nome =
            materia.querySelector(
                "h3"
            );


        if (!numero || !nome) {

            return;
        }


        const valor =
            parseInt(
                numero.textContent
            ) || 0;


        if (valor > maior) {

            maior = valor;

            nomeMaior =
                nome.textContent.trim();
        }
    });


    const elemento =
        document.getElementById(
            "melhor-materia"
        );


    if (elemento) {

        elemento.textContent =
            nomeMaior;
    }
}


// ======================================================
// CONQUISTAS
// ======================================================

function obterConquistas() {

    const historico =
        JSON.parse(
            localStorage.getItem(
                "historicoQuizzes"
            )
        ) || [];


    const conquistas = [];


    const totalQuestoes =
        historico.reduce(

            (total, item) =>
                total +
                (item.total || 0),

            0
        );


    const quizPerfeito =
        historico.some(
            item =>
                item.porcentagem === 100
        );


    const materiasConcluidas =
        contarMateriasConcluidas();


    if (historico.length >= 1) {

        conquistas.push({

            icone: "🎯",

            titulo:
                "Primeiro Quiz",

            texto:
                "Você realizou seu primeiro quiz."
        });
    }


    if (totalQuestoes >= 5) {

        conquistas.push({

            icone: "📝",

            titulo:
                "5 Questões",

            texto:
                "Você respondeu pelo menos 5 questões."
        });
    }


    if (quizPerfeito) {

        conquistas.push({

            icone: "🏆",

            titulo:
                "Quiz Perfeito",

            texto:
                "Você conseguiu 100% em um quiz."
        });
    }


    if (materiasConcluidas >= 1) {

        conquistas.push({

            icone: "📚",

            titulo:
                "Matéria Concluída",

            texto:
                "Você concluiu uma matéria."
        });
    }


    if (materiasConcluidas >= 4) {

        conquistas.push({

            icone: "🎓",

            titulo:
                "Estudante Dedicado",

            texto:
                "Você concluiu quatro matérias."
        });
    }


    return conquistas;
}


function contarMateriasConcluidas() {

    let quantidade = 0;


    const caminhos = [

        "/pages/areas/2ano/linguagens.html",

        "/pages/areas/2ano/matematica.html",

        "/pages/areas/2ano/natureza.html",

        "/pages/areas/2ano/humanas.html",

        "/pages/areas/3ano/linguagens.html",

        "/pages/areas/3ano/matematica.html",

        "/pages/areas/3ano/natureza.html",

        "/pages/areas/3ano/humanas.html"
    ];


    caminhos.forEach(caminho => {

        const chave =
            "checklist_" +
            normalizarCaminho(
                caminho
            );


        const dados =
            localStorage.getItem(
                chave
            );


        if (!dados) {

            return;
        }


        try {

            const estados =
                JSON.parse(dados);


            if (

                estados.length > 0 &&

                estados.every(
                    item => item === true
                )

            ) {

                quantidade++;
            }

        } catch (erro) {

            console.error(
                "Erro nas conquistas:",
                erro
            );
        }
    });


    return quantidade;
}


function carregarConquistas() {

    const container =
        document.getElementById(
            "lista-conquistas"
        );


    if (!container) {

        return;
    }


    const conquistas =
        obterConquistas();


    if (conquistas.length === 0) {

        container.innerHTML = `

            <div class="conquista-vazia">

                <span>🔒</span>

                <p>
                    Suas conquistas aparecerão
                    aqui conforme você estudar
                    e responder os quizzes.
                </p>

            </div>
        `;


        return;
    }


    container.innerHTML =
        conquistas.map(
            conquista => `

                <div class="conquista">

                    <div class="conquista-icone">
                        ${conquista.icone}
                    </div>

                    <div>

                        <h3>
                            ${conquista.titulo}
                        </h3>

                        <p>
                            ${conquista.texto}
                        </p>

                    </div>

                </div>

            `
        ).join("");
}


// ======================================================
// HISTÓRICO
// ======================================================

function carregarHistorico() {

    const container =
        document.getElementById(
            "historico-quizzes"
        );


    if (!container) {

        return;
    }


    const historico =
        JSON.parse(
            localStorage.getItem(
                "historicoQuizzes"
            )
        ) || [];


    if (historico.length === 0) {

        container.innerHTML = `

            <div class="historico-vazio">

                📖 Você ainda não realizou
                nenhum quiz.

            </div>
        `;


        return;
    }


    const recentes =
        [...historico]
            .reverse()
            .slice(0, 10);


    container.innerHTML =
        recentes.map(
            item => `

                <div class="historico-item">

                    <div>

                        <strong>
                            ${item.materia}
                        </strong>

                        <small>
                            ${item.data}
                        </small>

                    </div>


                    <div class="historico-nota">

                        ${item.pontos}/${item.total}

                        <span>
                            ${item.porcentagem}%
                        </span>

                    </div>

                </div>

            `
        ).join("");
}


// ======================================================
// BOTÃO DE LIMPAR DADOS
// ======================================================

function limparDadosEstudo() {

    const confirmar =
        confirm(
            "Tem certeza que deseja apagar todo o seu progresso, quizzes e conquistas?"
        );


    if (!confirmar) {

        return;
    }


    localStorage.clear();


    alert(
        "Todos os dados foram apagados."
    );


    window.location.reload();
}


// ======================================================
// ANIMAÇÕES
// ======================================================

function ativarAnimacoes() {

    const elementos =
        document.querySelectorAll(
            ".animar"
        );


    elementos.forEach(
        (elemento, index) => {

            elemento.style.animationDelay =
                (index * 0.08) +
                "s";
        }
    );
}


// ======================================================
// INICIALIZAÇÃO
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        carregarChecklist();

        carregarModoEscuro();

        atualizarDashboard();

        configurarPesquisa();

        atualizarNomeAluno();

        atualizarEstatisticas();

        atualizarMelhorMateria();

        carregarConquistas();

        carregarHistorico();

        ativarAnimacoes();
    }
);