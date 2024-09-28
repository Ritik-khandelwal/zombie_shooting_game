/* GLOBAL GAME VARIABLES */
const maxScore = 10;
let timerCount = 12;
let bullets = 11;
let score = 0;
let canShoot = false;
let gameStarted = false;

let timer;
let startTimerCount = 4;
let startTimer;

/* CAPTURED ELEMENTS */
const shootAudio = new Audio("https://cdn.pixabay.com/download/audio/2022/03/26/audio_d0ed19ffb1.mp3?filename=gun_in_small_room_02-107590.mp3");
shootAudio.volume = 0.07;
const moneySound = new Audio("https://cryptogunner.online/wp-content/uploads/2023/05/coins.mp3");
moneySound.volume = 0.2;

const bulletsElementNum = document.querySelector("#bullets-num");
const scoreElementNum = document.querySelector("#score-num");
const timerElementNum = document.querySelector("#timer-num");
const cursor = document.querySelector(".cursor");
const container = document.querySelector(".container");
const bulletHole = document.querySelector(".bulletHole");
const bloodSpot = document.querySelector(".bloodSpot");
const button = document.querySelector(".button");
const startTimerElementNum = document.getElementById("start-timer");
const gameRules = document.querySelector(".game-rules");

/* ZOMBIE AND MUSIC SPAWN SETTINGS */
const zombie = document.createElement("img");
zombie.setAttribute("class", "zombie");
let backgroundMusic;

// Randomly select a zombie and background music
const randomNumber = Math.floor(Math.random() * 100);
if (randomNumber <= 33) {
  zombie.setAttribute("src", "https://clipart-library.com/images_k/zombie-head-silhouette/zombie-head-silhouette-24.png");
  backgroundMusic = new Audio('https://cryptogunner.online/wp-content/uploads/2023/05/background-sound.mp3');
} else if (randomNumber <= 66) {
  zombie.setAttribute("src", "https://clipart-library.com/images_k/zombie-head-silhouette/zombie-head-silhouette-24.png");
  backgroundMusic = new Audio('https://cryptogunner.online/wp-content/uploads/2023/04/Creepy-Action.mp3');
} else {
  zombie.setAttribute("src", "https://clipart-library.com/images_k/zombie-head-silhouette/zombie-head-silhouette-24.png");
  backgroundMusic = new Audio('https://cryptogunner.online/wp-content/uploads/2023/04/Castle-of-Horrors.mp3');
}

const contHeight = container.offsetHeight;
const contWidth = container.offsetWidth;

// Random zombie movement every second
setInterval(() => {
  const randTop = Math.random() * (contHeight - 100);
  const randLeft = Math.random() * (contWidth - 100);
  zombie.style.position = "absolute";
  zombie.style.top = `${randTop}px`;
  zombie.style.left = `${randLeft}px`;
}, 1000);

/* GAME INFO INITIALIZATION */
bulletsElementNum.innerHTML = bullets;
scoreElementNum.innerHTML = `${score} / ${maxScore}`;
timerElementNum.innerHTML = timerCount;

/* FULLSCREEN FUNCTION */
function abrirTelaCheia() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) elem.requestFullscreen();
  else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen(); // Firefox
  else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen(); // Chrome, Safari, Opera
  else if (elem.msRequestFullscreen) elem.msRequestFullscreen(); // IE/Edge
}

/* START GAME */
button.addEventListener("mousedown", startGame);

async function startGame() {
  if (button.innerText === "START") {
    button.style.display = "none";
    gameRules.style.display = "none";
    abrirTelaCheia();

    startTimer = setInterval(() => {
      startTimerCount--;
      startTimerElementNum.innerText = startTimerCount;
      if (startTimerCount <= -1) {
        clearInterval(startTimer);
        startTimerElementNum.innerText = "GO!";
        startTimerElementNum.style.color = "#7CFC00";
        startTimerElementNum.style.fontFamily = '"Rubik Wet Paint", sans-serif';

        setTimeout(() => {
          startTimerElementNum.style.display = "none";
          initializeGame();
          backgroundMusic.volume = 0.1;
          backgroundMusic.play();
        }, 1000);
      }
    }, 1000);
  }
}

/* INITIALIZE GAME */
function initializeGame() {
  setTimeout(() => {
    canShoot = true;
  }, 420);

  gameStarted = true;
  document.body.style.cursor = "none";
  cursor.style.display = "block";
  container.appendChild(zombie);

  timer = setInterval(() => {
    timerCount--;
    timerElementNum.innerHTML = timerCount;
    if (timerCount <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

/* END GAME */
function endGame() {
  container.removeChild(zombie);
  button.innerText = "GAME OVER";
  gameStarted = false;
  document.body.style.cursor = "default";
  cursor.style.display = "none";

  const finalScore = (score / maxScore) * 100;
  let msg = "";

  if (finalScore < 33) msg = "Rank C: Zombie Novice - Keep practicing!";
  else if (finalScore < 66) msg = "Rank B: Undead Exterminator!";
  else if (finalScore < 99) msg = "Rank A: Zombie Slayer!";
  else if (finalScore === 100) msg = "Rank S: Apocalypse Conqueror!";

  container.innerHTML = `
    <div class="container-collect-cgun">
      <h2 style="color:white">${msg}</h2>
      <button id="collect-cgun-btn" onclick="collectCgun()">Click to collect ${score * 2} $CGUNs</button>
    </div>
  `;
}

/* COLLECT CGUN */
async function collectCgun() {
  const collectCgunBtn = document.getElementById("collect-cgun-btn");

  if (collectCgunBtn.textContent === "GRATS! Come back tomorrow!") {
    collectCgunBtn.textContent = "You already collected your prize today!";
    collectCgunBtn.disabled = true;
    return;
  }

  collectCgunBtn.textContent = "GRATS! Come back tomorrow!";
  moneySound.play();
  setTimeout(() => {
    location.reload();
  }, 1000);
}

/* SHOOTING LOGIC */
function shoot(e) {
  if (!canShoot) return;

  canShoot = false;
  e.preventDefault();
  bulletHole.style.top = `${e.pageY}px`;
  bulletHole.style.left = `${e.pageX}px`;
  shootAudio.play();

  bullets--;
  bulletsElementNum.innerHTML = bullets;

  // Hit detection on zombie
  if (e.target === zombie) {
    score++;
    bloodSpot.style.top = `${e.pageY}px`;
    bloodSpot.style.left = `${e.pageX}px`;
    bloodSpot.style.display = "block";
    bulletHole.style.display = "block";
    setTimeout(() => {
      bloodSpot.style.display = "none";
    }, 415);

    // Check if score reached maxScore
    if (score >= maxScore) {
      endGame();
    } else {
      scoreElementNum.innerHTML = `${score} / ${maxScore}`;
    }
  }

  if (bullets <= 0) {
    endGame();
  }

  setTimeout(() => {
    canShoot = true;
  }, 420);
}

/* EVENT LISTENERS */
window.addEventListener("mousedown", (e) => {
  if (gameStarted) shoot(e);
});

/* CROSSHAIR CURSOR TRACKER */
window.addEventListener("mousemove", (e) => {
  cursor.style.top = `${e.pageY}px`;
  cursor.style.left = `${e.pageX}px`;
});
