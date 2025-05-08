let info = document.querySelector(".info");
let lives = parseInt(sessionStorage.getItem("lives"));
let playerMarble = 10;
let soldierMarble = 10;
let marbleClickHandler;
let evenOddHandler;
let soldierBet;
let playerBet;
let random;
let gameName = sessionStorage.getItem("gameName");
let gunShotSound = new Audio("../sounds/gun-shot.mp3"),
  eliminatedSound = new Audio("../sounds/eliminated.mp3"),
  passSound = new Audio("../sounds/pass.mp3");
if (isNaN(lives) || lives <= 0 || gameName != "marble") {
  document.querySelector(".landscape-block").classList.add("active");
  setTimeout(() => {
    window.location.assign("../");
  }, 2000);
} else {
  updateLivesDisplay(lives);
  startGame();
}

function updateLivesDisplay(lives) {
  const livesImages = document.querySelectorAll(".lives img");
  livesImages.forEach((img, index) => {
    img.style.filter = index >= lives ? "saturate(0%)" : "saturate(100%)";
  });
}

function startGame(random = Math.round(Math.random())) {
  if (random == 0) {
    player();
    info.textContent = "Bet Your Marbles";
  } else {
    soldier();
    info.textContent = "Guess Even or Odd";
  }
}

function player() {
  document.querySelectorAll(".player>.marbles>.marble:not(.empty)").forEach(el => {
    el.classList.add('marble-glow')    
  });
  marbleClickHandler = function (e) {
    document.querySelectorAll(".player>.marbles>.marble").forEach(el => {
      el.classList.remove('marble-glow')    
    });
    document.querySelector(".hand-img-player").style.justifyContent = "end";
    setTimeout(() => {
      document.querySelector(".hand-img-soldier").style.justifyContent =
        "start";
    }, 800);
    setTimeout(() => {
      playerBet = parseInt(e.target.getAttribute("marble-size"));
      soldierCall = Math.floor(Math.random() * 2);
      if (
        (soldierCall == 0 && playerBet % 2 == 0) ||
        (soldierCall == 1 && playerBet % 2 != 0)
      ) {
        playerMarble -= playerBet;
        soldierMarble += playerBet;
        pointStatus(playerBet, "-", "player");
        pointStatus(playerBet, "+", "soldier");
      } else {
        soldierMarble -= playerBet;
        playerMarble += playerBet;
        pointStatus(playerBet, "+", "player");
        pointStatus(playerBet, "-", "soldier");
      }
      controller(1);
    }, 1000);
    setTimeout(() => {
      document.querySelector(".hand-img-player").style.justifyContent = "start";
      document.querySelector(".hand-img-soldier").style.justifyContent = "end";
    }, 2000);
  };
  document.querySelectorAll(".marble-player:not(.empty)").forEach((el) => {
    el.addEventListener("click", marbleClickHandler);
  });

  document.querySelectorAll(".btn").forEach((el) => {
    if (evenOddHandler) {
      el.removeEventListener("click", evenOddHandler);
    }
  });
}

function soldier() {
  document.querySelector(".decision-btn").classList.add('decision-btn-glow');
  document.querySelectorAll(".marble-player:not(.empty)").forEach((el) => {
    if (marbleClickHandler) {
      el.removeEventListener("click", marbleClickHandler);
    }
  });
  soldierBet = Math.ceil(Math.random() * soldierMarble);
  evenOddHandler = function (e) {
  document.querySelector(".decision-btn").classList.remove('decision-btn-glow');
    document.querySelector(".hand-img-soldier").style.justifyContent = "start";
    setTimeout(() => {
      document.querySelector(".hand-img-player").style.justifyContent = "end";
    }, 800);
    setTimeout(() => {
      if (
        (e.target.getAttribute("parity") == "even" && soldierBet % 2 == 0) ||
        (e.target.getAttribute("parity") == "odd" && soldierBet % 2 != 0)
      ) {
        playerMarble += soldierBet;
        soldierMarble -= soldierBet;

        pointStatus(soldierBet, "+", "player");
        pointStatus(soldierBet, "-", "soldier");
      } else {
        soldierMarble += soldierBet;
        playerMarble -= soldierBet;
        pointStatus(soldierBet, "+", "soldier");
        pointStatus(soldierBet, "-", "player");
      }
      controller(0);
    }, 1000);
    setTimeout(() => {
      document.querySelector(".hand-img-player").style.justifyContent = "start";
      document.querySelector(".hand-img-soldier").style.justifyContent = "end";
    }, 2000);
  };
  document.querySelectorAll(".btn").forEach((el) => {
    el.addEventListener("click", evenOddHandler);
  });
}

function controller(turn) {
  const gameOver = playerMarble >= 20 || soldierMarble >= 20;
  document.querySelectorAll(".marble-soldier").forEach((el, i) => {
    el.classList.toggle("empty", i >= soldierMarble);
  });
  document.querySelectorAll(".marble-player").forEach((el, i) => {
    el.classList.toggle("empty", i >= playerMarble);
  });

  if (gameOver) {
    if (playerMarble >= 20) {
      playerMarble = 20;
      endGame("Pass");
    } else {
      soldierMarble = 20;
      endGame("Eliminated");
    }
    document.querySelectorAll(".btn, .marble-player").forEach((el) => {
      el.removeEventListener("click", evenOddHandler);
      el.removeEventListener("click", marbleClickHandler);
    });

    return;
  }
  startGame(turn);
}

function pointStatus(bet, action, target) {
  let pointTarget = document.querySelector(`.status-${target}`);
  pointTarget.classList.add("status-active");
  pointTarget.textContent = action == "+" ? `+${bet}` : `-${bet}`;
  pointTarget.style.color = action == "+" ? "green" : "red";

  setTimeout(() => {
    pointTarget.classList.remove("status-active");
  }, 2000);
}

let msgCon = document.querySelector(".msg-con");
let msgText = document.querySelector(".msg");
let playerPic = document.querySelector(".player-picture");
let msgBtn = document.querySelector(".msg-btn-action");

function endGame(message) {
  setTimeout(() => {
    msgCon.style.display = "flex";
  }, 1000);

  msgText.textContent = message;

  if (message.includes("Pass")) {
    playerPic.src = "../images/happy.jpg";
    msgBtn.textContent = "Continue";
    msgBtn.addEventListener("click", () => {
      window.location.assign("../glassbridge/");
      sessionStorage.setItem("gameName", "glassbridge");
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

sessionStorage.removeItem("tileData");
sessionStorage.removeItem("randomMod");
