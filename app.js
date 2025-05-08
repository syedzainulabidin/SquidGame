// ! Elements
const dollElement = document.querySelector(".doll"),
  heroElement = document.querySelector(".hero"),
  timerElement = document.querySelector(".timer"),
  hintBar = document.querySelector(".perm"),
  messageBox = document.querySelector(".msg-con"),
  messageText = document.querySelector(".msg"),
  messageButton = document.querySelector(".msg-btn-action"),
  picture = document.querySelector(".player-picture");

// ! Audios
const redLightSound = new Audio("sounds/red-light.mp3"),
  greenLightSound = new Audio("sounds/green-light.mp3"),
  gunShotSound = new Audio("sounds/gun-shot.mp3"),
  runningSound = new Audio("sounds/running.mp3"),
  eliminatedSound = new Audio("sounds/eliminated.mp3"),
  passSound = new Audio("sounds/pass.mp3"),
  dollSongSound = new Audio("sounds/doll-song.mp3");

// ! Flags
let isHeld = false,
  gamePaused = false,
  dollRotationStopped = false;
dollSongSound.loop = true;

// ! Initials
let livesRemaining = 5,
  timeLeft = 24,
  position = 0;
dollSongSound.volume = 0.35;

// ? Interval and Timeouts
let timeoutOne, timeoutTwo, countdownTimer;

function onHoldStart() {
  isHeld = true;
  if (position === 0) {
    rotateDoll();
    startTimer();
  }
}

function onHoldEnd() {
  isHeld = false;
}

function handleInputListeners(add = true) {
  const method = add ? "addEventListener" : "removeEventListener";
  window[method]("mousedown", onHoldStart);
  window[method]("mouseup", onHoldEnd);
  window[method]("touchstart", onHoldStart);
  window[method]("touchend", onHoldEnd);
}

handleInputListeners();

setInterval(() => {
  if (isHeld && !gamePaused) {
    heroElement.style.bottom = `${position}px`;
    position++;
    if (runningSound.paused) runningSound.play();

    const goalHeight = window.screen.height - 250;
    const currentBottom = parseInt(heroElement.style.bottom || "0");

    if (goalHeight === currentBottom) {
      showMessage(true, "Pass", "Continue");
    } else if (dollElement.style.transform === "rotateZ(180deg)") {
      showMessage(
        true,
        "Eliminated",
        livesRemaining > 0
          ? `Try Again ? Lives: ${livesRemaining}`
          : "Start Over"
      );
    }
  } else {
    runningSound.pause();
    runningSound.currentTime = 0;
  }
}, 20);

function rotateDoll(state = "staring") {
  if (dollRotationStopped) return;

  clearTimeout(timeoutOne);
  clearTimeout(timeoutTwo);

  const delay = Math.random() * 4000 + 2000;
  const isStaring = state === "staring";

  dollElement.style.transform = isStaring ? "rotateZ(0deg)" : "rotateZ(180deg)";
  isStaring
    ? dollSongSound.play()
    : (dollSongSound.pause(), (dollSongSound.currentTime = 0));

  timeoutOne = setTimeout(() => {
    if (dollRotationStopped) return;

    hintBar.style.background = isStaring
      ? "linear-gradient(to bottom, rgba(128, 0, 0, 0.5), #121212)"
      : "linear-gradient(to bottom, rgba(0, 128, 0, 0.5), #121212)";
    (isStaring ? redLightSound : greenLightSound).play();
  }, delay);

  timeoutTwo = setTimeout(() => {
    if (!dollRotationStopped) rotateDoll(isStaring ? "away" : "staring");
  }, delay + 350);
}

function showMessage(show, text, buttonText, delay = 700, playSounds = true) {
  if (show) {
    handleInputListeners(false);
    isHeld = false;
    gamePaused = true;
  }

  if (text === "Eliminated") {
    dollRotationStopped = true;
    clearTimeout(timeoutOne);
    clearTimeout(timeoutTwo);
    dollSongSound.pause();
    dollSongSound.currentTime = 0;
    clearInterval(countdownTimer);
    countdownTimer = null;
  }

  setTimeout(() => {
    if (show) {
      messageBox.style.display = "flex";
      messageText.textContent = text;
      messageButton.textContent = buttonText;
      if (playSounds) {
        if (text === "Pass") {
          picture.src = "images/happy.jpg";
          passSound.play();
        } else if (text === "Eliminated") {
          picture.src = "images/angry.jpg";
          eliminatedSound.play();
          gunShotSound.play();
        }
      }
    } else {
      messageBox.style.display = "none";
      handleInputListeners(true);
      gamePaused = false;
    }
  }, delay);
}

function startTimer() {
  if (countdownTimer) return;
  countdownTimer = setInterval(() => {
    if (timeLeft >= 0) {
      timerElement.textContent = timeLeft;
      timeLeft--;
    } else {
      clearInterval(countdownTimer);
      countdownTimer = null;
      const heroBottom = parseInt(heroElement.style.bottom || "0");
      if (heroBottom < window.screen.height - 250) {
        showMessage(
          true,
          "Eliminated",
          livesRemaining > 0
            ? `Try Again ? Lives: ${livesRemaining}`
            : "Start Over"
        );
      }
    }
  }, 1000);
}

messageButton.addEventListener("pointerdown", (e) => {
  const action = e.target.textContent;
  action.startsWith("T") ? retryLife() : restartGame();
});

function retryLife() {
  livesRemaining--;
  updateLivesDisplay();
  if (livesRemaining >= 0) {
    resetGame();
    setTimeout(() => showMessage(false), 500);
  } else {
    showMessage(true, "Eliminated", "Start Over", 0, false);
  }
}

function updateLivesDisplay() {
  const livesImages = document.querySelectorAll(".lives img");
  livesImages.forEach((img, index) => {
    img.style.filter =
      index >= livesRemaining ? "saturate(0%)" : "saturate(100%)";
  });
}

function resetGame() {
  clearInterval(countdownTimer);
  countdownTimer = null;
  clearTimeout(timeoutOne);
  clearTimeout(timeoutTwo);
  dollRotationStopped = false;
  dollElement.style.transform = "rotateZ(0deg)";
  hintBar.style.background =
    "linear-gradient(to bottom, rgba(0, 128, 0, 0.5), #121212)";
  position = 0;
  heroElement.style.bottom = "0px";
  timeLeft = 24;
  timerElement.textContent = timeLeft;
  isHeld = false;
  handleInputListeners(true);
  rotateDoll("staring");
  startTimer();
}

function restartGame() {
  sessionStorage.setItem("lives", livesRemaining);
  sessionStorage.setItem("gameName", "dalgona")
  window.location.assign("dalgona/");
}

// * Zoom and Orientation Handling
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener(
    "touchstart",
    (e) => {
      if (e.scale !== 1) e.preventDefault();
    },
    { passive: false }
  );
  document.body.addEventListener(
    "touchmove",
    (e) => {
      if (e.scale !== 1) e.preventDefault();
    },
    { passive: false }
  );
  window.addEventListener(
    "wheel",
    (e) => {
      if (e.ctrlKey) e.preventDefault();
    },
    { passive: false }
  );
});

function isMobile() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

function checkOrientation() {
  if (isMobile()) {
    const isLandscape = window.innerWidth > window.innerHeight;
    const landscapeBlock = document.querySelector(".landscape-block");
    landscapeBlock.classList.toggle("active", isLandscape);
  }
}

window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
checkOrientation();
