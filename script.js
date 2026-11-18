const canvas = document.getElementById("jogo");
const ctx = canvas.getContext("2d");

const pontosElemento = document.getElementById("pontos");
const mensagemElemento = document.getElementById("mensagem");

const tamanho = 20;

let cobra = [];
let comida = {};

let direcao = {
    x: tamanho,
    y: 0
};

let proximaDirecao = {
    x: tamanho,
    y: 0
};

let pontos = 0;
let jogoRodando = true;
let jogoIniciado = false;

function ajustarTela() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function iniciarJogo() {
    ajustarTela();

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

    pontosElemento.textContent = "0";

    jogoRodando = true;
    jogoIniciado = false;

    mensagemElemento.textContent =
        "Use as setas ou WASD para começar.";

    mensagemElemento.style.color = "#ccc";

    gerarComida();
}

function gerarComida() {
    const colunas = Math.floor(canvas.width / tamanho);
    const linhas = Math.floor(canvas.height / tamanho);

    comida = {
        x: Math.floor(Math.random() * colunas) * tamanho,
        y: Math.floor(Math.random() * linhas) * tamanho
    };

    // Evita colocar a comida dentro da cobra
    for (const parte of cobra) {
        if (
            comida.x === parte.x &&
            comida.y === parte.y
        ) {
            gerarComida();
            return;
        }
    }
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

    else if (
        (tecla === "arrowdown" || tecla === "s") &&
        direcao.y === 0
    ) {
        proximaDirecao = {
            x: 0,
            y: tamanho
        };

        jogoIniciado = true;
    }

    else if (
        (tecla === "arrowleft" || tecla === "a") &&
        direcao.x === 0
    ) {
        proximaDirecao = {
            x: -tamanho,
            y: 0
        };

        jogoIniciado = true;
    }

    else if (
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

        if (index === 0) {
            ctx.fillStyle = "#6cff8f";
        } else {
            ctx.fillStyle = "#32c95b";
        }

        ctx.fill();

    });
}

function desenharComida() {

    const centroX = comida.x + tamanho / 2;
    const centroY = comida.y + tamanho / 2;

    // Brilho
    ctx.beginPath();

    ctx.arc(
        centroX,
        centroY,
        9,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "rgba(255, 60, 60, 0.25)";
    ctx.fill();

    // Comida
    ctx.beginPath();

    ctx.arc(
        centroX,
        centroY,
        7,
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

    // Colisão com as paredes
    if (
        novaCabeca.x < 0 ||
        novaCabeca.x >= canvas.width ||
        novaCabeca.y < 0 ||
        novaCabeca.y >= canvas.height
    ) {
        perder();
        return;
    }

    // Colisão com o próprio corpo
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

        pontosElemento.textContent = pontos;

        gerarComida();

    } else {

        cobra.pop();

    }
}

function perder() {

    jogoRodando = false;

    mensagemElemento.textContent =
        "FIM DE JOGO! Pontuação: " + pontos;

    mensagemElemento.style.color = "#ff4d4d";

    // Não existe botão de reiniciar.
    // O jogo permanece encerrado.
}

function loop() {

    atualizar();
    desenhar();

    if (jogoRodando) {
        setTimeout(loop, 100);
    }
}

window.addEventListener("resize", () => {

    if (jogoRodando) {
        ajustarTela();
    }

});

iniciarJogo();
loop();
