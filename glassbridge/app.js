let lives = parseInt(sessionStorage.getItem("lives"));
let tilePair = 1;
let tileHandler;
let random = null;
let player = document.querySelector(".player");
let randomMod;
let randomModCheck = JSON.parse(sessionStorage.getItem("randomMod"));
let tileData = JSON.parse(sessionStorage.getItem("tileData"));
let inc = -1;
let gameName = sessionStorage.getItem("gameName");
let gunShotSound = new Audio("../sounds/gun-shot.mp3"),
  eliminatedSound = new Audio("../sounds/eliminated.mp3"),
  passSound = new Audio("../sounds/pass.mp3"),
  fallingSound = new Audio("../sounds/falling.mp3"),
  tileBreakSound = new Audio("../sounds/glass-shattering.mp3");

if (randomModCheck == null) {
  randomMod = [null, null, null, null, null];
} else {
  randomMod = JSON.parse(sessionStorage.getItem("randomMod"));
}

if (isNaN(lives) || lives <= 0 || gameName != "glassbridge") {
  document.querySelector(".landscape-block").classList.add("active");
  setTimeout(() => {
    window.location.assign("../");
  }, 2000);
} else {
  updateLivesDisplay(lives);
  startGame();
}

if (tileData == null) {
  tileData = [];
} else {
  tileData.forEach((el) => {
    if (el !== null) {
      breakPro(el.parent, el.child);
    }
  });
}
function updateLivesDisplay(lives) {
  const livesImages = document.querySelectorAll(".lives img");
  livesImages.forEach((img, index) => {
    img.style.filter = index >= lives ? "saturate(0%)" : "saturate(100%)";
  });
}

function startGame() {
  tileHandler = function (e) {
    inc++;
    const currentTiles = document.querySelectorAll(
      `.tile-pair[data-pair="${tilePair}"]>.tile`
    );
    currentTiles.forEach((el) => el.removeEventListener("click", tileHandler));
    if (randomMod[tilePair - 1] == null) {
      random = Math.round(Math.random());
    } else {
      random = randomMod[tilePair - 1];
    }
    player.style.bottom = `calc(((100dvh - 50px) / 7) * ${tilePair})`;
    player.style.left = e.target.getAttribute("data-pos") + "%";
    randomMod[tilePair - 1] = random;
    const pos = e.target.getAttribute("data-pos");
    // console.log(random, pos);
    if ((random === 0 && pos === "25") || (random === 1 && pos === "75")) {
      // console.log("Fail");
      endGame("Eliminated");
      sessionStorage.setItem("randomMod", JSON.stringify(randomMod));
      breakTile(e.target);
    } else {
      tilePair++;
      const nextTiles = document.querySelectorAll(
        `.tile-pair[data-pair="${tilePair}"]>.tile`
      );
      nextTiles.forEach((el) => el.addEventListener("click", tileHandler));
    }
    if (tilePair == 6) {
      setTimeout(() => {
        player.style.bottom = `calc(((100dvh - 50px) / 7) * ${tilePair})`;
        player.style.left = 50 + "%";
        endGame("Pass");
      }, 500);
    }
  };
  document
    .querySelectorAll(`.tile-pair[data-pair="${tilePair}"]>.tile`)
    .forEach((el) => el.addEventListener("click", tileHandler));
}

function breakTile(target) {
  target.setAttribute("class", "tile-broken");

  tileData[inc] = {
    parent: target.parentElement.getAttribute("data-pair"),
    child: target.getAttribute("data-pos"),
  };

  sessionStorage.setItem("tileData", JSON.stringify(tileData));
}

function breakPro(parent, child) {
  document
    .querySelectorAll(
      `.tile-pair[data-pair="${parent}"]>.tile[data-pos="${child}"]`
    )
    .forEach((el) => {
      el.setAttribute("class", "tile-broken");
    });
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
    msgText.textContent = "WON";
    playerPic.src = "../images/happy.jpg";
    msgCon.style.backgroundImage = "url(../images/pig.jpg)";
    msgBtn.textContent = "Start Over";
    sessionStorage.clear();
    msgBtn.addEventListener("click", () => {
      window.location.assign("../");
    });
    passSound.play();
  } else if (message.includes("Eliminated")) {
    tileBreakSound.play();
    setTimeout(() => {
      fallingSound.play();
      player.classList.add("player-falling");
    }, 500);
    setTimeout(() => {
      gunShotSound.play();
    }, 700);
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
