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
  let recorde = localStorage.getItem('recorde') || 0
  let teclaEspaco = false;
  let Backspace = false;

  document.getElementById("recorde").innerHTML = recorde;

  function criarComida() {
    comida = {
      x:
        Math.floor(Math.random() * (larguraCampo / tamanhoGrade)) *
        tamanhoGrade,
      y:
        Math.floor(Math.random() * (alturaCampo / tamanhoGrade)) * tamanhoGrade,
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
      document.getElementById("pontos").innerHTML = pontos;
      atualizarRecorde();
    } else {
      cobrinha.pop();
    }

    const colidiu = cobrinha
      .slice(1)
      .some((part) => part.x === cabeca.x && part.y === cabeca.y);

    if (
      cabeca.x < 0 ||
      cabeca.x >= larguraCampo ||
      cabeca.y < 0 ||
      cabeca.y >= alturaCampo ||
      colidiu
    ) {
      clearInterval(idIntervalo);
      alert("Fim de jogo!");
      location.reload();
      teclaEspaco = false;
      Backspace = false;
      document.getElementById("start-button").disabled = false;
    } else {
      renderizarCobrinha();
    }
  }

  function renderizarCobrinha() {
    campoJogo.innerHTML = "";

    cobrinha.forEach((part) => {
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

  function lidarComCliqueMouse(evento) {
    const campoX =
      campoJogo.getBoundingClientRect().left +
      window.scrollX +
      larguraCampo / 2;
    const campoY =
      campoJogo.getBoundingClientRect().top + window.scrollY + alturaCampo / 2;

    const clickX = evento.clientX;
    const clickY = evento.clientY;

    const diffX = clickX - campoX;
    const diffY = clickY - campoY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0 && direcao !== "esquerda") {
        direcao = "direita";
      } else if (diffX < 0 && direcao !== "direita") {
        direcao = "esquerda";
      }
    } else {
      if (diffY > 0 && direcao !== "cima") {
        direcao = "baixo";
      } else if (diffY < 0 && direcao !== "baixo") {
        direcao = "cima";
      }
    }
  }

  function iniciarJogo() {
    criarComida();
    idIntervalo = setInterval(atualizarCobrinha, velocidade);
    document.getElementById("start-button").disabled = true;
    teclaEspaco = true;
    Backspace = true;
  }

  function atualizarRecorde() {
    // Atualiza o recorde no localStorage se necessário
    if (pontos > recorde) {
      recorde = pontos;
      localStorage.setItem('recorde', recorde);
      document.getElementById("recorde").innerHTML = recorde;
    }
  }

  document.getElementById("start-button").addEventListener("click", iniciarJogo);
  document.addEventListener("keydown", lidarComPressionamentoTecla);
  campoJogo.addEventListener("click", lidarComCliqueMouse);

  document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && teclaEspaco === false) {
      iniciarJogo();
    }
  });
  // zera recorde ao apertar a tecla bacspace
  document.addEventListener("keydown", (event) => {
    if (event.code === "Backspace" && Backspace === false) {
      recorde = 0
      localStorage.setItem('recorde', recorde);
      document.getElementById("recorde").innerHTML = recorde;
    }
  });

});
