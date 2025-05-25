let alpha = true;
let check = true;

// Show start instruction on page load
setupStartListener();

async function go() {
  if (alpha === false) return;
  alpha = false;
  check = true;
  let cnt = 1;
  let arr = [];

  while (check) {
    document.getElementById("level-title").innerText = "Current Level : " + cnt;
    arr.push(Math.floor(Math.random() * 4)); // 0 to 3
    makeSound(arr);
    for (let i = 0; i < cnt; i++) {
      let index = await waitForBtnClick();
      if (index !== arr[i]) {
        gameOver(cnt);
        check = false;
        alpha = true;
        return;
      }
      else{
        sound = new Audio("sounds/popSound.mp3");
        sound.play();
      }
    }
    cnt++;
  }
}

async function waitForBtnClick() {
  return new Promise((resolve) => {
    const btns = document.querySelectorAll(".btn");
    btns.forEach((btn, index) => {
      function handler() {
        btns.forEach((b) => b.removeEventListener("click", handler));
        resolve(index);
      }
      btn.addEventListener("click", handler);
    });
  });
}

function makeSound(arr) {
  function playNext() {
    let sound;
    switch (arr[arr.length - 1]) {
      case 0: sound = new Audio("sounds/green.mp3"); break;
      case 1: sound = new Audio("sounds/red.mp3"); break;
      case 2: sound = new Audio("sounds/yellow.mp3"); break;
      case 3: sound = new Audio("sounds/blue.mp3"); break;
      default: console.log("No Sound"); return;
    }
    try {
      sound.play();
      flashBtn(arr[arr.length - 1]);
    } catch (error) {
      console.error("Playback error occurred:", error);
    }
    return;
  }
  setTimeout(playNext, 1000);
}

function flashBtn(index) {
  const btns = document.querySelectorAll('.btn');
  const btn = btns[index];
  btn.classList.add('pressed');
  setTimeout(() => btn.classList.remove('pressed'), 500);
}

function showStartInstruction() {
  let msg;
  if (window.matchMedia("(max-width: 650px)").matches) {
    msg = "Tap anywhere to start";
  } else {
    msg = "Press Space Bar to Start";
  }
  document.getElementById("level-title").innerText = msg;
}

function gameOver(level) {
  document.body.classList.add("game-over");
  let msg;
  if (window.matchMedia("(max-width: 650px)").matches) {
    msg = "Game Over! You reached level " + level + ". Tap anywhere to restart.";
  } else {
    msg = "Game Over! You reached level " + level + ". Press Space Bar to Restart.";
  }
  document.getElementById("level-title").innerText = msg;

  try {
    new Audio("sounds/wrong.mp3").play();
  } catch (e) {}

  setTimeout(() => {
    document.body.classList.remove("game-over");
    setupStartListener();
  }, 400);
}

function startListener(e) {
  if (window.matchMedia("(max-width: 650px)").matches) {
    // On mobile: any tap or click
    window.removeEventListener("touchstart", startListener);
    window.removeEventListener("mousedown", startListener);
    go();
  } else {
    // On desktop: only Space bar
    if (e.code === "Space" || e.key === " ") {
      window.removeEventListener("keydown", startListener);
      go();
    }
  }
}

function setupStartListener() {
  alpha = true; // Allow game to start again
  check = false;
  showStartInstruction();
  if (window.matchMedia("(max-width: 650px)").matches) {
    window.addEventListener("touchstart", startListener);
    window.addEventListener("mousedown", startListener);
  } else {
    window.addEventListener("keydown", startListener);
  }
}

// Listen for changes in screen width and update instructions/listeners accordingly
window.matchMedia("(max-width: 650px)").addEventListener("change", (e) => {
  showStartInstruction();
  setupStartListener();
});
