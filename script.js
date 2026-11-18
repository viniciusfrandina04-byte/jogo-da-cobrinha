const canvas = document.getElementById("jogo");
const ctx = canvas.getContext("2d");

const tamanho = 20;

const placar = document.getElementById("pontos");
const mensagem = document.getElementById("mensagem");
const botao = document.getElementById("reiniciar");

let cobra;
let comida;

let dx;
let dy;

let pontos = 0;

let iniciou = false;
let terminou = false;

let proximaDirecao = null;

let velocidade = 150;


/* =========================
   COMIDA
========================= */

function novaComida() {

    const livres = [];

    for (let y = 0; y < canvas.height; y += tamanho) {

        for (let x = 0; x < canvas.width; x += tamanho) {

            const ocupada = cobra.some(
                parte =>
                    parte.x === x &&
                    parte.y === y
            );

            if (!ocupada) {

                livres.push({
                    x,
                    y
                });

            }

        }

    }

    return livres[
        Math.floor(Math.random() * livres.length)
    ];
}


/* =========================
   REINICIAR
========================= */

function reiniciar() {

    cobra = [
        {
            x: 200,
            y: 200
        }
    ];

    dx = 0;
    dy = 0;

    proximaDirecao = null;

    pontos = 0;

    velocidade = 150;

    iniciou = false;
    terminou = false;

    placar.textContent = "0";

    mensagem.textContent =
        "Use as setas ou WASD para começar.";

    mensagem.style.color = "#cfcfcf";

    botao.hidden = true;

    comida = novaComida();

    desenhar();
}


/* =========================
   CONTROLES
========================= */

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

    if (!direcoes[tecla]) {
        return;
    }

    event.preventDefault();

    if (terminou) {
        return;
    }

    const [novoDx, novoDy] =
        direcoes[tecla];

    /* Impede virar 180 graus */

    if (
        iniciou &&
        novoDx === -dx &&
        novoDy === -dy
    ) {
        return;
    }

    proximaDirecao = [
        novoDx,
        novoDy
    ];

    iniciou = true;
});


/* =========================
   ATUALIZAR
========================= */

function atualizar() {

    if (!iniciou || terminou) {
        return;
    }

    if (proximaDirecao) {

        [dx, dy] =
            proximaDirecao;

        proximaDirecao = null;
    }


    const cabeca = {

        x: cobra[0].x + dx,

        y: cobra[0].y + dy

    };


    /* Bateu na parede */

    if (
        cabeca.x < 0 ||
        cabeca.x >= canvas.width ||
        cabeca.y < 0 ||
        cabeca.y >= canvas.height
    ) {

        fimDeJogo();

        return;
    }


    /* Verifica comida */

    const comeu =
        comida &&
        cabeca.x === comida.x &&
        cabeca.y === comida.y;


    /*
       Se não comeu, a última parte
       da cobra vai sair. Por isso
       ela não conta como colisão.
    */

    const corpo =
        comeu
            ? cobra
            : cobra.slice(0, -1);


    /* Bateu no próprio corpo */

    const bateu =
        corpo.some(
            parte =>
                parte.x === cabeca.x &&
                parte.y === cabeca.y
        );


    if (bateu) {

        fimDeJogo();

        return;
    }


    cobra.unshift(cabeca);


    /* Comeu */

    if (comeu) {

        pontos++;

        placar.textContent =
            pontos;


        /* Aumenta a velocidade */

        velocidade =
            Math.max(
                65,
                150 - pontos * 4
            );


        comida = novaComida();

    }

    else {

        cobra.pop();

    }


    desenhar();
}


/* =========================
   DESENHAR COBRA
========================= */

function desenharCobra() {

    for (
        let i = 0;
        i < cobra.length;
        i++
    ) {

        const parte = cobra[i];

        const margem = 2;

        const x =
            parte.x + margem;

        const y =
            parte.y + margem;

        const largura =
            tamanho - margem * 2;


        /* Brilho */

        ctx.shadowBlur = 8;

        ctx.shadowColor =
            i === 0
                ? "rgba(110,255,145,0.7)"
                : "rgba(50,201,89,0.35)";


        /* Corpo arredondado */

        ctx.beginPath();

        ctx.roundRect(
            x,
            y,
            largura,
            largura,
            8
        );


        ctx.fillStyle =
            i === 0
                ? "#72ff94"
                : "#35c759";

        ctx.fill();


        ctx.shadowBlur = 0;


        /* Olhos da cabeça */

        if (i === 0) {

            desenharOlhos(
                x,
                y
            );

        }

    }

}


/* =========================
   OLHOS
========================= */

function desenharOlhos(x, y) {

    ctx.fillStyle = "#102015";


    let olho1;
    let olho2;


    if (dx > 0) {

        olho1 = {
            x: x + 13,
            y: y + 5
        };

        olho2 = {
            x: x + 13,
            y: y + 11
        };

    }

    else if (dx < 0) {

        olho1 = {
            x: x + 5,
            y: y + 5
        };

        olho2 = {
            x: x + 5,
            y: y + 11
        };

    }

    else if (dy < 0) {

        olho1 = {
            x: x + 5,
            y: y + 5
        };

        olho2 = {
            x: x + 11,
            y: y + 5
        };

    }

    else {

        olho1 = {
            x: x + 5,
            y: y + 13
        };

        olho2 = {
            x: x + 11,
            y: y + 13
        };

    }


    ctx.beginPath();

    ctx.arc(
        olho1.x,
        olho1.y,
        1.7,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        olho2.x,
        olho2.y,
        1.7,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* =========================
   DESENHAR COMIDA
========================= */

function desenharComida() {

    const centroX =
        comida.x + tamanho / 2;

    const centroY =
        comida.y + tamanho / 2;


    /* Brilho */

    ctx.beginPath();

    ctx.arc(
        centroX,
        centroY,
        10,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(255, 59, 48, 0.20)";

    ctx.fill();


    /* Comida */

    ctx.beginPath();

    ctx.arc(
        centroX,
        centroY,
        7,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#ff3b30";

    ctx.fill();

}


/* =========================
   DESENHAR
========================= */

function desenhar() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* Fundo */

    ctx.fillStyle =
        "#070907";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    desenharComida();

    desenharCobra();

}


/* =========================
   GAME OVER
========================= */

function fimDeJogo() {

    terminou = true;

    mensagem.textContent =
        "Fim de jogo! Pontuação: " +
        pontos;

    mensagem.style.color =
        "#ff5555";

    botao.hidden = false;
}


/* =========================
   BOTÃO
========================= */

botao.addEventListener(
    "click",
    reiniciar
);


/* =========================
   LOOP
========================= */

function loop() {

    atualizar();

    setTimeout(
        loop,
        velocidade
    );

}


/* =========================
   COMEÇAR
========================= */

reiniciar();

loop();
