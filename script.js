const canvas = document.getElementById("jogo");
const ctx = canvas.getContext("2d");

const pontosTexto = document.getElementById("pontos");
const mensagem = document.getElementById("mensagem");

const tamanho = 20;

let cobra = [];
let direcao = { x: tamanho, y: 0 };
let proximaDirecao = { x: tamanho, y: 0 };

let comida;
let pontos = 0;

let jogoRodando = true;
let jogoIniciado = false;

function ajustarCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

ajustarCanvas();

window.addEventListener("resize", () => {
    ajustarCanvas();
});

function iniciar() {

    cobra = [
        {
            x: Math.floor(canvas.width / 2 / tamanho) * tamanho,
            y: Math.floor(canvas.height / 2 / tamanho) * tamanho
        }
    ];

    direcao = {
        x: tamanho,
        y: 0
    };

    proximaDirecao = {
        x: tamanho,
        y: 0
    };

    pontos = 0;

    pontosTexto.textContent = pontos;

    comida = gerarComida();

    jogoRodando = true;
    jogoIniciado = false;

    mensagem.textContent = "Use as setas ou WASD para começar.";
    mensagem.style.color = "#ccc";
}

function gerarComida() {

    const colunas = Math.floor(canvas.width / tamanho);
    const linhas = Math.floor(canvas.height / tamanho);

    return {
        x: Math.floor(Math.random() * colunas) * tamanho,
        y: Math.floor(Math.random() * linhas) * tamanho
    };
}

document.addEventListener("keydown", (event) => {

    if (!jogoRodando) {
        return;
    }

    const tecla = event.key.toLowerCase();

    if (
        (tecla === "arrowup" || tecla === "w") &&
        direcao.y === 0
    ) {
        proximaDirecao = {
            x: 0,
            y: -tamanho
        };

        jogoIniciado = true;
    }

    if (
        (tecla === "arrowdown" || tecla === "s") &&
        direcao.y === 0
    ) {
        proximaDirecao = {
            x: 0,
            y: tamanho
        };

        jogoIniciado = true;
    }

    if (
        (tecla === "arrowleft" || tecla === "a") &&
        direcao.x === 0
    ) {
        proximaDirecao = {
            x: -tamanho,
            y: 0
        };

        jogoIniciado = true;
    }

    if (
        (tecla === "arrowright" || tecla === "d") &&
        direcao.x === 0
    ) {
        proximaDirecao = {
            x: tamanho,
            y: 0
        };

        jogoIniciado = true;
    }
});

function desenharCobra() {

    cobra.forEach((parte, index) => {

        const margem = 2;

        ctx.beginPath();

        ctx.roundRect(
            parte.x + margem,
            parte.y + margem,
            tamanho - margem * 2,
            tamanho - margem * 2,
            7
        );

        ctx.fillStyle =
            index === 0
                ? "#69ff8c"
                : "#35c759";

        ctx.fill();

    });
}

function desenharComida() {

    ctx.beginPath();

    ctx.arc(
        comida.x + tamanho / 2,
        comida.y + tamanho / 2,
        tamanho / 2 - 3,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ff3b30";
    ctx.fill();

}

function desenhar() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

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

    mensagem.textContent =
        "Fim de jogo! Pontuação: " + pontos;

    mensagem.style.color = "#ff3b30";

    // Não existe botão de reiniciar.
    // Depois de perder, o jogo fica encerrado.
}

function loop() {

    atualizar();
    desenhar();

    if (jogoRodando) {
        setTimeout(loop, 100);
    }
}

iniciar();
loop();
