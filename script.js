const canvas = document.getElementById("jogo");
const ctx = canvas.getContext("2d");

const pontosElemento = document.getElementById("pontos");
const mensagemElemento = document.getElementById("mensagem");

const TAMANHO = 20;

let cobra = [];
let comida = {};

let direcao = "direita";
let proximaDirecao = "direita";

let pontos = 0;
let jogoAtivo = true;

let ultimoMovimento = 0;
const velocidade = 100;


// ==========================
// TAMANHO DA TELA
// ==========================

function ajustarTela() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}


// ==========================
// INICIAR JOGO
// ==========================

function iniciarJogo() {

    ajustarTela();

    const centroX =
        Math.floor(canvas.width / TAMANHO / 2) * TAMANHO;

    const centroY =
        Math.floor(canvas.height / TAMANHO / 2) * TAMANHO;

    cobra = [
        { x: centroX, y: centroY },
        { x: centroX - TAMANHO, y: centroY },
        { x: centroX - TAMANHO * 2, y: centroY }
    ];

    pontos = 0;

    pontosElemento.textContent = pontos;

    direcao = "direita";
    proximaDirecao = "direita";

    jogoAtivo = true;

    mensagemElemento.textContent =
        "Use as setas ou WASD para jogar";

    mensagemElemento.style.color = "#ddd";

    criarComida();
}


// ==========================
// CRIAR COMIDA
// ==========================

function criarComida() {

    const colunas =
        Math.floor(canvas.width / TAMANHO);

    const linhas =
        Math.floor(canvas.height / TAMANHO);

    let novaComida;

    do {

        novaComida = {
            x: Math.floor(Math.random() * colunas) * TAMANHO,
            y: Math.floor(Math.random() * linhas) * TAMANHO
        };

    } while (
        cobra.some(
            parte =>
                parte.x === novaComida.x &&
                parte.y === novaComida.y
        )
    );

    comida = novaComida;
}


// ==========================
// CONTROLES
// ==========================

document.addEventListener("keydown", function (event) {

    const tecla = event.key.toLowerCase();

    if (!jogoAtivo) {
        return;
    }

    if (
        (tecla === "arrowup" || tecla === "w") &&
        direcao !== "baixo"
    ) {
        proximaDirecao = "cima";
    }

    else if (
        (tecla === "arrowdown" || tecla === "s") &&
        direcao !== "cima"
    ) {
        proximaDirecao = "baixo";
    }

    else if (
        (tecla === "arrowleft" || tecla === "a") &&
        direcao !== "direita"
    ) {
        proximaDirecao = "esquerda";
    }

    else if (
        (tecla === "arrowright" || tecla === "d") &&
        direcao !== "esquerda"
    ) {
        proximaDirecao = "direita";
    }
});


// ==========================
// ATUALIZAR COBRA
// ==========================

function atualizar() {

    direcao = proximaDirecao;

    const cabeca = {
        x: cobra[0].x,
        y: cobra[0].y
    };


    // Movimento

    if (direcao === "cima") {
        cabeca.y -= TAMANHO;
    }

    if (direcao === "baixo") {
        cabeca.y += TAMANHO;
    }

    if (direcao === "esquerda") {
        cabeca.x -= TAMANHO;
    }

    if (direcao === "direita") {
        cabeca.x += TAMANHO;
    }


    // ==========================
    // BATEU NA PAREDE
    // ==========================

    if (
        cabeca.x < 0 ||
        cabeca.y < 0 ||
        cabeca.x >= canvas.width ||
        cabeca.y >= canvas.height
    ) {
        perder();
        return;
    }


    // ==========================
    // BATEU NO PRÓPRIO CORPO
    // ==========================

    for (let i = 0; i < cobra.length; i++) {

        if (
            cabeca.x === cobra[i].x &&
            cabeca.y === cobra[i].y
        ) {
            perder();
            return;
        }
    }


    // Coloca nova cabeça

    cobra.unshift(cabeca);


    // ==========================
    // COMEU
    // ==========================

    if (
        cabeca.x === comida.x &&
        cabeca.y === comida.y
    ) {

        pontos++;

        pontosElemento.textContent = pontos;

        criarComida();

    } else {

        // Remove a cauda
        cobra.pop();
    }
}


// ==========================
// DESENHAR
// ==========================

function desenhar() {

    // Fundo

    ctx.fillStyle = "#181818";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Grade

    ctx.strokeStyle = "rgba(255,255,255,0.025)";
    ctx.lineWidth = 1;

    for (
        let x = 0;
        x < canvas.width;
        x += TAMANHO
    ) {

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (
        let y = 0;
        y < canvas.height;
        y += TAMANHO
    ) {

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }


    // ==========================
    // COMIDA
    // ==========================

    ctx.beginPath();

    ctx.arc(
        comida.x + TAMANHO / 2,
        comida.y + TAMANHO / 2,
        7,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ff3b30";

    ctx.fill();


    // ==========================
    // COBRA
    // ==========================

    for (let i = 0; i < cobra.length; i++) {

        const parte = cobra[i];

        ctx.beginPath();

        const margem = 2;

        ctx.roundRect(
            parte.x + margem,
            parte.y + margem,
            TAMANHO - margem * 2,
            TAMANHO - margem * 2,
            6
        );

        if (i === 0) {
            ctx.fillStyle = "#65ff8a";
        } else {
            ctx.fillStyle = "#35c759";
        }

        ctx.fill();
    }
}


// ==========================
// GAME OVER
// ==========================

function perder() {

    jogoAtivo = false;

    mensagemElemento.textContent =
        "FIM DE JOGO! Pontuação: " + pontos;

    mensagemElemento.style.color = "#ff4d4d";

    desenhar();
}


// ==========================
// LOOP DO JOGO
// ==========================

function loop(tempo) {

    if (!ultimoMovimento) {
        ultimoMovimento = tempo;
    }

    if (
        jogoAtivo &&
        tempo - ultimoMovimento >= velocidade
    ) {

        atualizar();

        ultimoMovimento = tempo;
    }

    desenhar();

    requestAnimationFrame(loop);
}


// ==========================
// INICIAR
// ==========================

window.addEventListener("resize", function () {

    if (jogoAtivo) {
        ajustarTela();
    }

});

iniciarJogo();

requestAnimationFrame(loop);
