var audio = new Audio('som/bazinga.mp3');
var currentColorIndex = 0;

// Lista de cores
var colors = ['#1212de', '#c200cc', '#fff700', '#4682b4', '#32cd32', '#ffa500', '#9fa19f', '#ed2222']; 

function playSound() {
  var clone = audio.cloneNode();
  clone.currentTime = audio.currentTime;
  clone.play();
  
  mudarCorDefundo();
}

function mudarCorDefundo() {
  // Mudar a cor de fundo
  document.body.style.backgroundColor = colors[currentColorIndex];
  currentColorIndex = (currentColorIndex + 1) % colors.length; // Avança para a próxima cor
}