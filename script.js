const canvas = document.getElementById("jogo");
const ctx = canvas.getContext("2d");

const pontosTexto = document.getElementById("pontos");
const mensagem = document.getElementById("mensagem");
const botaoReiniciar = document.getElementById("reiniciar");

const tamanhoBase = 20;

function ajustarCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

ajustarCanvas();

window.addEventListener("resize", ajustarCanvas);

let cobra = [
    { x: 200, y: 200 },
    { x: 180, y: 200 },
    { x: 160, y: 200 }
];

let direcao = { x: tamanhoBase, y: 0 };
let proximaDirecao = { x: tamanhoBase, y: 0 };

let comida = gerarComida();

let pontos = 0;
let jogoRodando = true;
let jogoIniciado = false;

function gerarComida() {
    const colunas = Math.floor(canvas.width / tamanhoBase);
    const linhas = Math.floor(canvas.height / tamanhoBase);

    return {
        x: Math.floor(Math.random() * colunas) * tamanhoBase,
        y: Math.floor(Math.random() * linhas) * tamanhoBase
    };
}

document.addEventListener("keydown", function (event) {

    if (!jogoRodando) return;

    if (
        (event.key === "ArrowUp" || event.key.toLowerCase() === "w") &&
        direcao.y === 0
    ) {
        proximaDirecao = { x: 0, y: -tamanhoBase };
        jogoIniciado = true;
    }

    if (
        (event.key === "ArrowDown" || event.key.toLowerCase() === "s") &&
        direcao.y === 0
    ) {
        proximaDirecao = { x: 0, y: tamanhoBase };
        jogoIniciado = true;
    }

    if (
        (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") &&
        direcao.x === 0
    ) {
        proximaDirecao = { x: -tamanhoBase, y: 0 };
        jogoIniciado = true;
    }

    if (
        (event.key === "ArrowRight" || event.key.toLowerCase() === "d") &&
        direcao.x === 0
    ) {
        proximaDirecao = { x: tamanhoBase, y: 0 };
        jogoIniciado = true;
    }
});

function desenharCobra() {
    cobra.forEach((parte, index) => {

        ctx.beginPath();

        const raio = 8;

        ctx.roundRect(
            parte.x + 2,
            parte.y + 2,
            tamanhoBase - 4,
            tamanhoBase - 4,
            raio
        );

        ctx.fillStyle = index === 0 ? "#66ff88" : "#35c759";
        ctx.fill();

    });
}

function desenharComida() {

    ctx.beginPath();

    ctx.arc(
        comida.x + tamanhoBase / 2,
        comida.y + tamanhoBase / 2,
        tamanhoBase / 2 - 3,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ff3b30";
    ctx.fill();

}

function desenhar() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    desenharComida();
    desenharCobra();

}

function atualizar() {

    if (!jogoRodando || !jogoIniciado) {
        return;
    }

    direcao = proximaDirecao;

    const novaCabeca = {
        x: cobra[0].x + direcao.x,
        y: cobra[0].y + direcao.y
    };

    // Bateu na parede
    if (
        novaCabeca.x < 0 ||
        novaCabeca.x >= canvas.width ||
        novaCabeca.y < 0 ||
        novaCabeca.y >= canvas.height
    ) {
        perder();
        return;
    }

    // Bateu no próprio corpo
    for (let i = 0; i < cobra.length; i++) {

        if (
            novaCabeca.x === cobra[i].x &&
            novaCabeca.y === cobra[i].y
        ) {
            perder();
            return;
        }

    }

    cobra.unshift(novaCabeca);

    // Comeu a comida
    if (
        novaCabeca.x === comida.x &&
        novaCabeca.y === comida.y
    ) {

        pontos++;

        pontosTexto.textContent = pontos;

        comida = gerarComida();

    } else {

        cobra.pop();

    }

}

function perder() {

    jogoRodando = false;

    mensagem.textContent = "GAME OVER — você perdeu!";

    mensagem.style.color = "#ff3b30";

    // Não mostra botão para reiniciar
    botaoReiniciar.hidden = true;

}

function loop() {

    atualizar();
    desenhar();

    if (jogoRodando) {
        setTimeout(loop, 100);
    }

}

loop();
