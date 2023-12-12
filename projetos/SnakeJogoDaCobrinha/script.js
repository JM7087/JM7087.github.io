document.addEventListener("DOMContentLoaded", () => {
    const campoJogo = document.getElementById("game-board");
    const larguraCampo = 800;
    const alturaCampo = 500;
    const tamanhoGrade = 20;
    const velocidadeInicialCobrinha = 200;
  
    let cobrinha = [{ x: 0, y: 0 }];
    let comida = {};
    let direcao = "direita";
    let idIntervalo;
    let velocidade = velocidadeInicialCobrinha;
    let pontos = 0;
    let teclaEspaco = false;
  
    function criarComida() {
      comida = {
        x: Math.floor(Math.random() * (larguraCampo / tamanhoGrade)) * tamanhoGrade,
        y: Math.floor(Math.random() * (alturaCampo / tamanhoGrade)) * tamanhoGrade
      };
  
      const elementoComida = document.createElement("div");
      elementoComida.style.left = `${comida.x}px`;
      elementoComida.style.top = `${comida.y}px`;
      elementoComida.id = "food";
      campoJogo.appendChild(elementoComida);
    }
  
    function atualizarCobrinha() {
      const cabeca = { x: cobrinha[0].x, y: cobrinha[0].y };
  
      if (direcao === "direita") {
        cabeca.x += tamanhoGrade;
      } else if (direcao === "esquerda") {
        cabeca.x -= tamanhoGrade;
      } else if (direcao === "cima") {
        cabeca.y -= tamanhoGrade;
      } else if (direcao === "baixo") {
        cabeca.y += tamanhoGrade;
      }
  
      cobrinha.unshift(cabeca);
  
      if (cabeca.x === comida.x && cabeca.y === comida.y) {
        campoJogo.removeChild(document.getElementById("food"));
        criarComida();
        velocidade -= 5;
        pontos++;
        document.getElementById("score").innerHTML = pontos;
      } else {
        cobrinha.pop();
      }
  
      const colidiu = cobrinha.slice(1).some(part => part.x === cabeca.x && part.y === cabeca.y);
  
      if (cabeca.x < 0 || cabeca.x >= larguraCampo || cabeca.y < 0 || cabeca.y >= alturaCampo || colidiu) {
        clearInterval(idIntervalo);
        alert("Fim de jogo!");
        location.reload();
        teclaEspaco = false;
        document.getElementById("start-button").disabled = false;
      } else {
        renderizarCobrinha();
      }
    }
  
    function renderizarCobrinha() {
      campoJogo.innerHTML = "";
  
      cobrinha.forEach(part => {
        const elementoParte = document.createElement("div");
        elementoParte.className = "snake-body";
        elementoParte.style.left = `${part.x}px`;
        elementoParte.style.top = `${part.y}px`;
        campoJogo.appendChild(elementoParte);
      });
  
      const elementoComida = document.createElement("div");
      elementoComida.style.left = `${comida.x}px`;
      elementoComida.style.top = `${comida.y}px`;
      elementoComida.id = "food";
      campoJogo.appendChild(elementoComida);
    }
  
    function lidarComPressionamentoTecla(evento) {
      const teclaPressionada = evento.key;
  
      if (teclaPressionada === "ArrowUp" && direcao !== "baixo") {
        direcao = "cima";
      } else if (teclaPressionada === "ArrowDown" && direcao !== "cima") {
        direcao = "baixo";
      } else if (teclaPressionada === "ArrowLeft" && direcao !== "direita") {
        direcao = "esquerda";
      } else if (teclaPressionada === "ArrowRight" && direcao !== "esquerda") {
        direcao = "direita";
      }
    }
  
    function iniciarJogo() {
      criarComida();
      idIntervalo = setInterval(atualizarCobrinha, velocidade);
      document.getElementById("start-button").disabled = true;
      teclaEspaco = true;
    }
  
    document.getElementById("start-button").addEventListener("click", iniciarJogo);
  
    document.addEventListener("keydown", lidarComPressionamentoTecla);
  
    document.addEventListener("keydown", (event) => {
      if (event.code === "Space" && teclaEspaco === false) {
        iniciarJogo();
      }
    });
  });
  