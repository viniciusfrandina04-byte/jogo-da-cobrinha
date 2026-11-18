const canvas = document.getElementById("jogo");
const ctx = canvas.getContext("2d");

const pontosTexto = document.getElementById("pontos");
const mensagem = document.getElementById("mensagem");
const botaoReiniciar = document.getElementById("reiniciar");

const tamanho = 20;
const colunas = canvas.width / tamanho;
const linhas = canvas.height / tamanho;

let cobra;
let direcao;
let proximaDirecao;
let faca;
let pontos;
let jogoRodando = false;
let intervalo;

// Imagens
const imagemHomem = new Image();
imagemHomem.src = "mortadela.png";

const imagemFaca = new Image();
imagemFaca.src = "faca.png";

// =========================
// INICIAR JOGO
// =========================

function iniciarJogo() {
    cobra = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];

    direcao = { x: 0, y: 0 };
    proximaDirecao = { x: 0, y: 0 };

    pontos = 0;
    pontosTexto.textContent = pontos;

    faca = criarFaca();

    jogoRodando = false;

    mensagem.textContent =
        "Use as setas, WASD ou os controles para começar.";

    botaoReiniciar.hidden = true;

    clearInterval(intervalo);

    desenhar();
}

// =========================
// CRIAR FACA
// =========================

function criarFaca() {
    let novaFaca;

    do {
        novaFaca = {
            x: Math.floor(Math.random() * colunas),
            y: Math.floor(Math.random() * linhas)
        };
    } while (
        cobra.some(
            parte =>
                parte.x === novaFaca.x &&
                parte.y === novaFaca.y
        )
    );

    return novaFaca;
}

// =========================
// COMEÇAR
// =========================

function comecar() {
    if (jogoRodando) return;

    if (direcao.x === 0 && direcao.y === 0) {
        direcao = { x: 1, y: 0 };
        proximaDirecao = { x: 1, y: 0 };
    }

    jogoRodando = true;

    mensagem.textContent = "Pegue as facas e faça a maior pontuação!";

    intervalo = setInterval(atualizar, 110);
}

// =========================
// ATUALIZAR JOGO
// =========================

function atualizar() {
    direcao = proximaDirecao;

    const cabeca = {
        x: cobra[0].x + direcao.x,
        y: cobra[0].y + direcao.y
    };

    // Bateu na parede
    if (
        cabeca.x < 0 ||
        cabeca.x >= colunas ||
        cabeca.y < 0 ||
        cabeca.y >= linhas
    ) {
        gameOver();
        return;
    }

    // Bateu no próprio corpo
    if (
        cobra.some(
            parte =>
                parte.x === cabeca.x &&
                parte.y === cabeca.y
        )
    ) {
        gameOver();
        return;
    }

    cobra.unshift(cabeca);

    // Pegou a faca
    if (
        cabeca.x === faca.x &&
        cabeca.y === faca.y
    ) {
        pontos++;
        pontosTexto.textContent = pontos;

        faca = criarFaca();
    } else {
        cobra.pop();
    }

    desenhar();
}

// =========================
// DESENHAR
// =========================

function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fundo
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    desenharGrade();
    desenharFaca();
    desenharCobra();
}

// =========================
// GRADE
// =========================

function desenharGrade() {
    ctx.strokeStyle = "rgba(255,255,255,0.035)";
    ctx.lineWidth = 1;

    for (let x = 0; x <= canvas.width; x += tamanho) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += tamanho) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// =========================
// DESENHAR COBRINHA
// =========================

function desenharCobra() {
    cobra.forEach((parte, index) => {
        const x = parte.x * tamanho;
        const y = parte.y * tamanho;

        const margem = 2;
        const tamanhoParte = tamanho - margem * 2;

        // Se a imagem do homem estiver carregada
        if (imagemHomem.complete && imagemHomem.naturalWidth > 0) {

            ctx.save();

            // Clipping arredondado
            ctx.beginPath();

            ctx.roundRect(
                x + margem,
                y + margem,
                tamanhoParte,
                tamanhoParte,
                7
            );

            ctx.clip();

            ctx.drawImage(
                imagemHomem,
                x + margem,
                y + margem,
                tamanhoParte,
                tamanhoParte
            );

            ctx.restore();

        } else {
            // Fallback caso a imagem não carregue
            ctx.fillStyle = index === 0 ? "#22c55e" : "#16a34a";

            ctx.beginPath();

            ctx.roundRect(
                x + margem,
                y + margem,
                tamanhoParte,
                tamanhoParte,
                7
            );

            ctx.fill();
        }

        // Destaque na cabeça
        if (index === 0) {
            ctx.strokeStyle = "rgba(255,255,255,0.7)";
            ctx.lineWidth = 1.5;

            ctx.beginPath();

            ctx.roundRect(
                x + margem,
                y + margem,
                tamanhoParte,
                tamanhoParte,
                7
            );

            ctx.stroke();
        }
    });
}

// =========================
// DESENHAR FACA
// =========================

function desenharFaca() {
    const x = faca.x * tamanho;
    const y = faca.y * tamanho;

    if (imagemFaca.complete && imagemFaca.naturalWidth > 0) {

        ctx.save();

        // Fundo circular discreto
        ctx.fillStyle = "rgba(239, 68, 68, 0.12)";

        ctx.beginPath();
        ctx.arc(
            x + tamanho / 2,
            y + tamanho / 2,
            9,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // Imagem da faca
        ctx.drawImage(
            imagemFaca,
            x + 2,
            y + 2,
            tamanho - 4,
            tamanho - 4
        );

        ctx.restore();

    } else {
        // Fallback: desenha uma faca simples,
        // sem usar estrela ou outro símbolo.
        ctx.save();

        ctx.translate(
            x + tamanho / 2,
            y + tamanho / 2
        );

        ctx.rotate(-0.7);

        // Lâmina
        ctx.fillStyle = "#e5e7eb";

        ctx.beginPath();
        ctx.moveTo(-7, -2);
        ctx.lineTo(5, -2);
        ctx.lineTo(8, 0);
        ctx.lineTo(5, 2);
        ctx.lineTo(-7, 2);
        ctx.closePath();
        ctx.fill();

        // Cabo
        ctx.fillStyle = "#92400e";

        ctx.fillRect(
            -9,
            -2,
            4,
            4
        );

        ctx.restore();
    }
}

// =========================
// GAME OVER
// =========================

function gameOver() {
    jogoRodando = false;

    clearInterval(intervalo);

    mensagem.textContent =
        `Fim de jogo! Pontuação: ${pontos}`;

    botaoReiniciar.hidden = false;

    desenhar();
}

// =========================
// DIREÇÃO
// =========================

function mudarDirecao(x, y) {
    // Não deixa virar diretamente para trás
    if (
        direcao.x === -x &&
        direcao.y === -y
    ) {
        return;
    }

    proximaDirecao = { x, y };

    comecar();
}

// =========================
// TECLADO
// =========================

document.addEventListener("keydown", function (event) {

    const tecla = event.key.toLowerCase();

    if (
        tecla === "arrowup" ||
        tecla === "w"
    ) {
        mudarDirecao(0, -1);
    }

    else if (
        tecla === "arrowdown" ||
        tecla === "s"
    ) {
        mudarDirecao(0, 1);
    }

    else if (
        tecla === "arrowleft" ||
        tecla === "a"
    ) {
        mudarDirecao(-1, 0);
    }

    else if (
        tecla === "arrowright" ||
        tecla === "d"
    ) {
        mudarDirecao(1, 0);
    }
});

// =========================
// CONTROLES DO CELULAR
// =========================

function configurarBotao(id, x, y) {
    const botao = document.getElementById(id);

    if (!botao) return;

    botao.addEventListener("click", function () {
        mudarDirecao(x, y);
    });

    botao.addEventListener(
        "touchstart",
        function (event) {
            event.preventDefault();
            mudarDirecao(x, y);
        },
        { passive: false }
    );
}

configurarBotao("cima", 0, -1);
configurarBotao("baixo", 0, 1);
configurarBotao("esquerda", -1, 0);
configurarBotao("direita", 1, 0);

// =========================
// DESLIZAR O DEDO
// =========================

let toqueInicialX = 0;
let toqueInicialY = 0;

canvas.addEventListener(
    "touchstart",
    function (event) {
        const toque = event.touches[0];

        toqueInicialX = toque.clientX;
        toqueInicialY = toque.clientY;
    },
    { passive: true }
);

canvas.addEventListener(
    "touchend",
    function (event) {

        const toque = event.changedTouches[0];

        const diferencaX =
            toque.clientX - toqueInicialX;

        const diferencaY =
            toque.clientY - toqueInicialY;

        const minimo = 25;

        if (
            Math.abs(diferencaX) < minimo &&
            Math.abs(diferencaY) < minimo
        ) {
            comecar();
            return;
        }

        if (
            Math.abs(diferencaX) >
            Math.abs(diferencaY)
        ) {

            if (diferencaX > 0) {
                mudarDirecao(1, 0);
            } else {
                mudarDirecao(-1, 0);
            }

        } else {

            if (diferencaY > 0) {
                mudarDirecao(0, 1);
            } else {
                mudarDirecao(0, -1);
            }
        }

    },
    { passive: true }
);

// =========================
// REINICIAR
// =========================

botaoReiniciar.addEventListener(
    "click",
    iniciarJogo
);

// Iniciar
iniciarJogo();
