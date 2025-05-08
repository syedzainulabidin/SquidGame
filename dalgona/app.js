// lives = 5;
let gunShotSound = new Audio("../sounds/gun-shot.mp3"),
  eliminatedSound = new Audio("../sounds/eliminated.mp3"),
  passSound = new Audio("../sounds/pass.mp3"),
  crack = new Audio("../sounds/crack.mp3");
let lives = parseInt(sessionStorage.getItem("lives"));
gameName = "dalgona";
if (isNaN(lives) || lives <= 0 || gameName != "dalgona") {
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

document.querySelectorAll(".cookie").forEach((el) => {
  el.addEventListener("click", (e) => {
    const shape = el.getAttribute("data-shape");
    cookieSetup(shape);
  });
});

const cookie = document.querySelector(".main-cookie");
function cookieSetup(shape) {
  const cookieContainer = document.querySelector(".canvas");
  cookieContainer.style.display = "flex";

  if (window.innerWidth > window.innerHeight) {
    cookie.style.height = "100%";
  } else {
    cookie.style.width = "100%";
  }

  const selectedCookie = document.querySelector(
    `.cookie[data-shape="${shape}"]`
  );
  const svg = selectedCookie.querySelector("svg").cloneNode(true);

  cookie.innerHTML = "";

  cookie.innerHTML += `<div class="detector detector-${shape} detector-active"></div>
  <div class="detector detector-${shape} detector-active"></div>
  <div class="detector detector-${shape} detector-active"></div>
  <div class="detector detector-${shape} detector-active"></div>
  <div class="detector detector-${shape} detector-active"></div>`;

  cookie.appendChild(svg);
  if (window.innerWidth > window.innerHeight) {
    svg.style.height = "80%";
    svg.style.width = "auto";
  } else {
    svg.style.width = "80%";
    svg.style.height = "auto";
  }
  checkMouse();
}

let entered = false;
let timerStarted = false;
let timerCount = 30;
let clear;
let detectorCount = 0;

function checkMouse() {
  document.body.addEventListener("mouseover", function (e) {
    if (
      e.target.tagName === "path" ||
      e.target.tagName === "polygon" ||
      e.target.tagName === "circle"
    ) {
      if (!entered) {
        entered = true;
        document.querySelectorAll(".detector").forEach((el) => {
          el.style.zIndex = 1;
        });
        setTimeout(() => {
          document.querySelector(".landing").style.width = "5%";
          document.querySelector(".landing").style.outline = "5px solid white";
        }, 1000);
        mouseTracking();
        if (!timerStarted) {
          timerStarted = true;
          timer();
        }
      }
    }
  });
}

function mouseTracking() {
  const detectors = document.querySelectorAll(".detector-active");
  const hoveredDetectors = new Set();
  const totalDetectors = detectors.length;
  let landingHovered = false;
  let landingElement = document.querySelector(".landing");

  document
    .querySelector(".main-cookie")
    .addEventListener("mouseover", function (e) {
      if (
        e.target.tagName === "path" ||
        e.target.tagName === "polygon" ||
        e.target.tagName === "circle"
      ) {
        clearInterval(clear);
      }
    });

  detectors.forEach((el, index) => {
    el.addEventListener("mouseover", () => {
      if (!hoveredDetectors.has(index)) {
        hoveredDetectors.add(index);
      }
    });
  });

  landingElement.addEventListener("mouseover", () => {
    if (hoveredDetectors.size === totalDetectors && !landingHovered) {
      landingHovered = true;
      clearInterval(clear);
    }
  });

  const handleFirstMouseMove = (e) => {
    setMouseLanding(e.clientX, e.clientY);
    document.removeEventListener("mousemove", handleFirstMouseMove);
  };
  document.addEventListener("mousemove", handleFirstMouseMove);
}

function setMouseLanding(x, y) {
  let landing = document.querySelector(".landing");
  landing.style.left = x + "px";
  landing.style.top = y + "px";
}

function timer() {
  clear = setInterval(() => {
    if (timerCount <= 0) {
      clearInterval(clear);
    } else {
      timerCount--;
      document.querySelector(".timer").innerHTML = timerCount;
    }
  }, 1000);
}
function showMessage(outcome) {
  const msgContainer = document.querySelector(".msg-con");
  const msgText = document.querySelector(".msg");
  const msgButton = document.querySelector(".msg-btn-action");
  const playerImage = document.querySelector(".player-picture");

  setTimeout(() => {
    msgContainer.style.display = "flex";
  }, 1000);
  if (outcome === "win") {
    passSound.play();
    msgText.textContent = "Pass";
    playerImage.src = "../images/happy.jpg";
    msgButton.textContent = "Continue";
    msgButton.onclick = () => {
      sessionStorage.setItem("gameName", "tugofwar");
      window.location.assign("../tugofwar/");
    };
  } else if (outcome === "loss") {
    cookie.style.background =
      "goldenrod url('../images/crack.png') no-repeat center center";
    crack.play();
    setTimeout(() => {
      eliminatedSound.play();
      gunShotSound.play();
      msgText.textContent = "Eliminated";
      playerImage.src = "../images/angry.jpg";
      msgButton.textContent = "Try Again";
      sessionStorage.setItem("lives", lives - 1);
      msgButton.onclick = () => {
        location.reload();
      };
    }, 500);
  }
}

function timer() {
  clear = setInterval(() => {
    if (timerCount <= 0) {
      clearInterval(clear);
      showMessage("loss");
    } else {
      timerCount--;
      document.querySelector(".timer").innerHTML = timerCount;
    }
  }, 1000);
}

function mouseTracking() {
  const detectors = document.querySelectorAll(".detector-active");
  const hoveredDetectors = new Set();
  const totalDetectors = detectors.length;
  let landingHovered = false;
  let landingElement = document.querySelector(".landing");

  document
    .querySelector(".main-cookie")
    .addEventListener("mouseover", function (e) {
      if (
        e.target.tagName === "path" ||
        e.target.tagName === "polygon" ||
        e.target.tagName === "circle"
      ) {
        clearInterval(clear);
        showMessage("loss");
      }
    });

  detectors.forEach((el, index) => {
    el.addEventListener("mouseover", () => {
      if (!hoveredDetectors.has(index)) {
        hoveredDetectors.add(index);
      }
    });
  });

  landingElement.addEventListener("mouseover", () => {
    if (hoveredDetectors.size === totalDetectors && !landingHovered) {
      landingHovered = true;
      clearInterval(clear);
      showMessage("win");
    }
  });

  const handleFirstMouseMove = (e) => {
    setMouseLanding(e.clientX, e.clientY);
    document.removeEventListener("mousemove", handleFirstMouseMove);
  };
  document.addEventListener("mousemove", handleFirstMouseMove);
}

if(/Mobi|Android/i.test(navigator.userAgent)){
  sessionStorage.setItem("gameName", "tugofwar");
  window.location.assign("../tugofwar/");
}
