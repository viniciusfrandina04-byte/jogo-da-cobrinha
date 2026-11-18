const canvas = document.getElementById("jogo");
const ctx = canvas.getContext("2d");

const tamanho = 20;
const colunas = canvas.width / tamanho;
const linhas = canvas.height / tamanho;

const placar = document.getElementById("pontos");
const mensagem = document.getElementById("mensagem");
const botao = document.getElementById("reiniciar");

let cobra, comida, dx, dy, pontos;
let iniciou, terminou, proximaDirecao;

function novaComida() {
    const livres = [];

    for (let y = 0; y < linhas; y++) {
        for (let x = 0; x < colunas; x++) {
            const pos = {
                x: x * tamanho,
                y: y * tamanho
            };

            if (!cobra.some(p => p.x === pos.x && p.y === pos.y)) {
                livres.push(pos);
            }
        }
    }

    return livres.length
        ? livres[Math.floor(Math.random() * livres.length)]
        : null;
}

function reiniciar() {
    cobra = [{ x: 200, y: 200 }];

    dx = 0;
    dy = 0;

    proximaDirecao = null;

    pontos = 0;
    iniciou = false;
    terminou = false;

    placar.textContent = "0";

    mensagem.textContent =
        "Use as setas ou WASD para começar.";

    botao.hidden = true;

    comida = novaComida();

    desenhar();
}

function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (comida) {
        ctx.fillStyle = "red";
        ctx.fillRect(comida.x, comida.y, tamanho, tamanho);
    }

    ctx.fillStyle = "lime";

    cobra.forEach(parte => {
        ctx.fillRect(parte.x, parte.y, tamanho, tamanho);
    });
}

function fim(texto) {
    terminou = true;

    mensagem.textContent =
        texto + " Pontuação: " + pontos;

    botao.hidden = false;
}

document.addEventListener("keydown", event => {
    const tecla = event.key.toLowerCase();

    const direcoes = {
        arrowup: [0, -tamanho],
        w: [0, -tamanho],

        arrowdown: [0, tamanho],
        s: [0, tamanho],

        arrowleft: [-tamanho, 0],
        a: [-tamanho, 0],

        arrowright: [tamanho, 0],
        d: [tamanho, 0]
    };

    if (!direcoes[tecla]) return;

    event.preventDefault();

    if (terminou || proximaDirecao) return;

    const [novoDx, novoDy] = direcoes[tecla];

    if (iniciou && novoDx === -dx && novoDy === -dy) {
        return;
    }

    proximaDirecao = [novoDx, novoDy];
    iniciou = true;
});

function atualizar() {
    if (!iniciou || terminou) return;

    if (proximaDirecao) {
        [dx, dy] = proximaDirecao;
        proximaDirecao = null;
    }

    const cabeca = {
        x: cobra[0].x + dx,
        y: cobra[0].y + dy
    };

    const comeu = comida &&
        cabeca.x === comida.x &&
        cabeca.y === comida.y;

    const corpo = comeu ? cobra : cobra.slice(0, -1);

    if (
        cabeca.x < 0 ||
        cabeca.x >= canvas.width ||
        cabeca.y < 0 ||
        cabeca.y >= canvas.height ||
        corpo.some(p => p.x === cabeca.x && p.y === cabeca.y)
    ) {
        fim("Fim de jogo!");
        return;
    }

    cobra.unshift(cabeca);

    if (comeu) {
        pontos++;

        placar.textContent = pontos;

        comida = novaComida();

        if (!comida) {
            fim("Você venceu!");
        }
    } else {
        cobra.pop();
    }

    desenhar();
}

botao.addEventListener("click", reiniciar);

reiniciar();

setInterval(atualizar, 180);
