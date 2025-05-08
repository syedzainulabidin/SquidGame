let lives = parseInt(sessionStorage.getItem("lives"));
let gunShotSound = new Audio("../sounds/gun-shot.mp3"),
  eliminatedSound = new Audio("../sounds/eliminated.mp3"),
  passSound = new Audio("../sounds/pass.mp3"),
  running = new Audio("../sounds/running.mp3");
let gameName = sessionStorage.getItem("gameName");
if (isNaN(lives) || lives <= 0 || gameName != "tugofwar") {
  document.querySelector(".landscape-block").classList.add("active");
  setTimeout(() => {
    window.location.assign("../");
  }, 2000);
} else {
  updateLivesDisplay(lives);
}

function updateLivesDisplay(lives) {
  const livesImages = document.querySelectorAll(".lives img");
  livesImages.forEach((img, index) => {
    img.style.filter = index >= lives ? "saturate(0%)" : "saturate(100%)";
  });
}

let game = document.querySelector(".canvas");
let timerDisplay = document.querySelector(".timer");

let val = 50;
let pullInterval;
let countdownInterval;
let timeLeft = 15;


function startGame() {
  document.removeEventListener('click',startGame)
  document.addEventListener("click", moving);
  console.log("Game started");

  pullInterval = setInterval(() => {
    val += 1;
    game.style.left = val + "%";

    if (val >= 75) {
      endGame("Eliminated!");
    }
  }, 200);

  countdownInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(pullInterval);
      clearInterval(countdownInterval);
      checkWinnerOnTimeout();
    }
  }, 1000);
}

document.addEventListener("click", startGame);

function moving() {
  if (!pullInterval) return;
  running.play();

  val -= 1;
  if (val < 0) val = 0;
  game.style.left = val + "%";

  if (val <= 25) {
    endGame("Pass");
  }
}

function checkWinnerOnTimeout() {
  running.pause();
  if (val < 50) {
    endGame("Pass");
  } else if (val > 50) {
    endGame("Eliminated");
  } else {
    endGame("Tie");
  }
}

let msgCon = document.querySelector(".msg-con");
let msgText = document.querySelector(".msg");
let playerPic = document.querySelector(".player-picture");
let msgBtn = document.querySelector(".msg-btn-action");

function endGame(message) {
  running.pause();
  document.removeEventListener("click", moving);
  clearInterval(pullInterval);
  clearInterval(countdownInterval);

  setTimeout(() => {
    msgCon.style.display = "flex";
  }, 1000);

  msgText.textContent = message;

  if (message.includes("Pass")) {
    playerPic.src = "../images/happy.jpg";
    msgBtn.textContent = "Continue";
    msgBtn.addEventListener("click", () => {
      window.location.assign("../marble/");
      sessionStorage.setItem("gameName", "marble");
    });
    passSound.play();
  } else if (message.includes("Eliminated")) {
    gunShotSound.play();
    setTimeout(() => {
      eliminatedSound.play();
      playerPic.src = "../images/angry.jpg";
      msgBtn.textContent = "Try Again";
      sessionStorage.setItem("lives", lives - 1);
    }, 500);
  } else {
    location.reload();
  }
}

msgBtn.addEventListener("click", () => {
  location.reload();
});
