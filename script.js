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
