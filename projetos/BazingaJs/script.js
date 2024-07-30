var audio = new Audio('som/bazinga.mp3');

function playSound() {
  var clone = audio.cloneNode();
  clone.currentTime = audio.currentTime;
  clone.play();
}
