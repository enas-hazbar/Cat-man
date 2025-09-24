document.addEventListener("DOMContentLoaded", () => {
    const scoreDisplay = document.getElementById("score");
    const livesDisplay = document.getElementById("lives");
    const grid = document.querySelector(".grid");
    const width = 28;
const params = new URLSearchParams(window.location.search);
const maze = params.get("maze") || "1";
    const popup = document.getElementById("popup1");
    const closeBtn = document.querySelector(".close");

    const gameOverPopup = document.getElementById("gameOverPopup");
    const closeGameOverBtn = document.querySelector(".close-gameover");
    // const restartBtn = document.querySelector(".restart-btn");

    const eatDotSound = new Audio("Sounds/cat-eating-81278 (mp3cut (mp3cut.net).mp3");
    const eatPower = new Audio("Sounds/game-bonus-02-294436.mp3");
    const eatDogs = new Audio("Sounds/video-game-bonus-323603 (mp3cut.net).mp3");
    const losingLive = new Audio("Sounds/080047_lose_funny_retro_video-game-80925 (mp3cut.net).mp3")
    const gameOverSound = new Audio("Sounds/game-over-39-199830 (mp3cut.net).mp3")
    const winingGame = new Audio("Sounds/winning-218995 (mp3cut.net).mp3")
const bgMusic = new Audio("Sounds/game-music-loop-7-145285.mp3");
bgMusic.addEventListener("canplaythrough", () => {
  console.log("✅ Music loaded");
});
bgMusic.addEventListener("error", (e) => {
  console.error("❌ Error loading music", e);
});

bgMusic.loop = true;
bgMusic.volume = 1;
   

    let score = 0;
    let lives = 3;
let pacmanCurrentIndex;
let pacmanDirection = 1; // start still
let hasStartedMoving = false;
let pacmanInterval = null;           // Store the interval ID
let scareTimeoutId = null;
let flashTimeoutId = null;
let scareCountdown = 0;
let scareCountdownInterval = null;

let layout;
if (maze === "1") layout = maze1;
if (maze === "2") layout = maze2;
if (maze === "3") layout = maze3;


const squares = [];

    class Dog {
        constructor(className, startIndex, speed) {
            this.className = className;
            this.startIndex = startIndex;
            this.speed = speed;
            this.currentIndex = startIndex;
            this.isScared = false;
            this.timerId = NaN;
        }
    }

    const dogs = [
        new Dog("chase", 348, 250), // Blinky style
        new Dog("skye", 376, 400),  // Pinky style
        new Dog("zuma", 351, 300),  // Inky style
        new Dog("rocky", 379, 500), // Clyde style
    ];



    // ----------------- Functions -----------------
    function updateLives() {
        livesDisplay.innerHTML = "Lives: ";
        for (let i = 0; i < lives; i++) {
            livesDisplay.innerHTML += "❤️";
        }
        losingLive.play()
    }

    function createBoard() {
        for (let i = 0; i < layout.length; i++) {
            const square = document.createElement("div");
            square.id = i;
            grid.appendChild(square);
            squares.push(square);

            if (layout[i] === 0) square.classList.add("pac-dot");
            if (layout[i] === 1) square.classList.add("wall");
            if (layout[i] === 2) square.classList.add("dog-lair");
            if (layout[i] === 3) square.classList.add("power-pellet");
            if (layout[i] === 5) square.classList.add("escape-door");
        }
    }
function resetDogs() {
    dogs.forEach(dog => {
        dog.currentIndex = dog.startIndex;
        dog.isScared = false;
        dog.isReturning = false;
        squares.forEach(square => 
            square.classList.remove(dog.className, "dog", "scared-dog", "returning")
        );
        squares[dog.currentIndex].classList.add(dog.className, "dog");
    });
}


function updatePacmanDirection(e) {
  switch (e.key) {
    case "ArrowLeft": pacmanDirection = -1; break;
    case "ArrowUp": pacmanDirection = -width; break;
    case "ArrowRight": pacmanDirection = 1; break;
    case "ArrowDown": pacmanDirection = width; break;
    default: return;
  }

  if (!hasStartedMoving) {
    hasStartedMoving = true;
    pacmanInterval = setInterval(movePacmanContinuously, 150);

    // 🟢 Start background music only once
    if (bgMusic.paused) {
      bgMusic.currentTime = 0;
      bgMusic.play().catch(err => console.log("Autoplay blocked:", err));
    }

    dogs.forEach(dog => moveDog(dog));
  }
}


function movePacmanContinuously() {
    squares[pacmanCurrentIndex].classList.remove("pac-man");

    let nextIndex = pacmanCurrentIndex + pacmanDirection;

    // prevent moving into walls or dog lair
    if (
        (pacmanDirection === -1 && (pacmanCurrentIndex % width === 0 || squares[nextIndex].classList.contains("wall") || squares[nextIndex].classList.contains("dog-lair"))) ||
        (pacmanDirection === 1 && (pacmanCurrentIndex % width === width - 1 || squares[nextIndex].classList.contains("wall") || squares[nextIndex].classList.contains("dog-lair"))) ||
        (pacmanDirection === -width && (pacmanCurrentIndex - width < 0 || squares[nextIndex].classList.contains("wall") || squares[nextIndex].classList.contains("dog-lair"))) ||
        (pacmanDirection === width && (pacmanCurrentIndex + width >= width * width || squares[nextIndex].classList.contains("wall") || squares[nextIndex].classList.contains("dog-lair")))
    ) {
        squares[pacmanCurrentIndex].classList.add("pac-man");
        return;
    }

    // move Pac-Man
    pacmanCurrentIndex = nextIndex;

    // handle tunnel wrap
    if (pacmanCurrentIndex - 1 === 363) pacmanCurrentIndex = 391;
    if (pacmanCurrentIndex + 1 === 392) pacmanCurrentIndex = 364;

    squares[pacmanCurrentIndex].classList.add("pac-man");

    pacDotEaten();
    powerPelletEaten();
    checkForGameOver();
    checkForEscape();
}


    function pacDotEaten() {
        if (squares[pacmanCurrentIndex].classList.contains("pac-dot")) {
            score++;
            eatDotSound.play();
            scoreDisplay.innerHTML = score;
            squares[pacmanCurrentIndex].classList.remove("pac-dot");
        }
    }
function powerPelletEaten() {
    if (squares[pacmanCurrentIndex].classList.contains("power-pellet")) {
        score += 10;
        eatPower.play();
        scoreDisplay.innerHTML = score;

        dogs.forEach(dog => {
            if (!dog.isReturning) {
                dog.isScared = true;
                squares[dog.currentIndex].classList.add("scared-dog");
            }
        });

        // Show the clock
        const clock = document.getElementById("scared-clock");
        clock.style.display = "block";

        // Clear previous timers
        if (scareTimeoutId) clearTimeout(scareTimeoutId);
        if (flashTimeoutId) clearTimeout(flashTimeoutId);
        if (scareCountdownInterval) clearInterval(scareCountdownInterval);

        // Setup countdown
        scareCountdown = 10;
        const progressCircle = document.getElementById("scared-clock-progress");
        const numberEl = document.getElementById("scared-clock-number");
        const circumference = 2 * Math.PI * 25;

        progressCircle.style.strokeDashoffset = 0;
        numberEl.textContent = scareCountdown;

        scareCountdownInterval = setInterval(() => {
            scareCountdown--;
            const offset = circumference * (1 - scareCountdown / 10);
            progressCircle.style.strokeDashoffset = offset;
            numberEl.textContent = scareCountdown > 0 ? scareCountdown : '';

            if (scareCountdown <= 0) {
                clearInterval(scareCountdownInterval);
            }
        }, 1000);

        // Optional: start flashing dogs 3s before end
        flashTimeoutId = setTimeout(() => {
            dogs.forEach(dog => {
                if (dog.isScared) {
                    squares[dog.currentIndex].classList.add("scared-dog-warning");
                }
            });
        }, 7000);

        // Unscare dogs after 10 seconds
        scareTimeoutId = setTimeout(() => {
            unScareDogs();
            clock.style.display = "none"; // hide clock when dogs are normal
        }, 10000);

        squares[pacmanCurrentIndex].classList.remove("power-pellet");
    }
}


function unScareDogs() {
    dogs.forEach(dog => {
        dog.isScared = false;
        if (dog.isReturning) {
            dog.isReturning = false;
            squares[dog.currentIndex].classList.remove("scared-dog", "returning");
        }
    });
    scareTimeoutId = null; // reset
}



    function getTarget(dog) {
        if (dog.className === "chase") {
            return pacmanCurrentIndex; // Blinky
        }
        if (dog.className === "skye") {
            return pacmanCurrentIndex + pacmanDirection * 4; // Pinky
        }
        if (dog.className === "zuma") {
            let blinky = dogs.find(d => d.className === "chase");
            let ahead = pacmanCurrentIndex + pacmanDirection * 2;
            return ahead + (ahead - blinky.currentIndex); // Inky
        }
        if (dog.className === "rocky") {
            let distance = Math.abs(dog.currentIndex - pacmanCurrentIndex);
            if (distance > 8) return pacmanCurrentIndex;
            return width * (width - 2); // Clyde runs away to corner
        }
    }

function moveDog(dog) { 
    dog.timerId = setInterval(() => {
        // Returning dogs should stay in lair
        if (dog.isReturning) {
            // Force dog to remain at lair
            squares[dog.currentIndex].classList.remove(dog.className, "dog", "scared-dog");
            dog.currentIndex = dog.startIndex;
            squares[dog.currentIndex].classList.add(dog.className, "dog", "returning");
            return; // stop moving until unScareDogs() releases it
        }

        const directions = [-1, 1, width, -width];
        let target = getTarget(dog);

        let bestDirection = directions[0];
        let shortestDistance = Infinity;

        directions.forEach(dir => {
            let nextIndex = dog.currentIndex + dir;
            if (
                !squares[nextIndex].classList.contains("wall") &&
                !squares[nextIndex].classList.contains("dog-lair") &&
                !squares[nextIndex].classList.contains("dog")
            ) {
                let distance = Math.hypot(
                    (nextIndex % width) - (target % width),
                    Math.floor(nextIndex / width) - Math.floor(target / width)
                );
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    bestDirection = dir;
                }
            }
        });

        squares[dog.currentIndex].classList.remove(dog.className, "dog", "scared-dog");
        dog.currentIndex += bestDirection;
        squares[dog.currentIndex].classList.add(dog.className, "dog");

        if (dog.isScared) {
            squares[dog.currentIndex].classList.add("scared-dog");
        }

        // eaten by pacman
dogs.forEach(dog => {
    if (dog.isScared && dog.currentIndex === pacmanCurrentIndex) {
        dog.isScared = false;
        dog.isReturning = true;
        squares[dog.currentIndex].classList.remove(dog.className, "dog", "scared-dog");
        dog.currentIndex = dog.startIndex;
        squares[dog.currentIndex].classList.add(dog.className, "dog", "returning");

        score += 100;
        eatDogs.play();
        scoreDisplay.innerHTML = score;
    }
});

        checkForGameOver();
    }, dog.speed);
}

   function checkForGameOver() {
    // Ignore collisions until Pac-Man has started moving
    if (!hasStartedMoving) return;

    const dogHere = dogs.find(dog => dog.currentIndex === pacmanCurrentIndex);
    if (dogHere && !dogHere.isScared && !dogHere.isReturning) {
        lives--;
        updateLives();

        if (lives > 0) {
            resetPacman();
        } else {
            gameOver();
        gameOverSound.play()

        } 

    }

    
}


function resetPacman() {
    // Stop Pac-Man
    if (pacmanInterval) clearInterval(pacmanInterval);
    hasStartedMoving = false;
    pacmanDirection = 0;

    // Stop dogs
    stopDogs();

    // Remove Pac-Man from old square
    squares[pacmanCurrentIndex].classList.remove("pac-man");

    // Respawn Pac-Man
    pacmanCurrentIndex = 29;
    squares[pacmanCurrentIndex].classList.add("pac-man");

    // Reset dogs
    resetDogs();
}

function stopDogs() {
    dogs.forEach(dog => {
        if (dog.timerId) {
            clearInterval(dog.timerId);
            dog.timerId = null;
        }
    });
}


function gameOver() {
  dogs.forEach(dog => clearInterval(dog.timerId));
  document.removeEventListener("keyup", updatePacmanDirection);
  gameOverPopup.style.display = "flex";

  bgMusic.pause();
  bgMusic.currentTime = 0;

  gameOverSound.play();
}

function checkForEscape() {
  if (squares[pacmanCurrentIndex].classList.contains("escape-door")) {
    dogs.forEach(dog => clearInterval(dog.timerId));
    document.removeEventListener("keyup", updatePacmanDirection);

    bgMusic.pause();
    bgMusic.currentTime = 0;

    winingGame.play();

    setTimeout(() => {
      popup.style.display = "flex";
    }, 200);
  }
}


function startGame() {
    squares.forEach(square => square.remove());
    squares.length = 0;

    popup.style.display = "none";
    gameOverPopup.style.display = "none";
   
    score = 0;
    lives = 3;
    updateLives();
    scoreDisplay.innerHTML = score;

    createBoard();

    pacmanCurrentIndex = 29;
    pacmanDirection = 0; // not moving until key press
    squares[pacmanCurrentIndex].classList.add("pac-man");

    resetDogs(); // 🐶 reset dogs, but don’t start moving yet

    document.addEventListener("keydown", updatePacmanDirection);

}

    // ----------------- Event Listeners -----------------
    closeBtn.addEventListener("click", () => (popup.style.display = "none"));
    closeGameOverBtn.addEventListener(
        "click",
        () => (gameOverPopup.style.display = "none")
    );
    // restartBtn.addEventListener("click", startGame);

    window.addEventListener("click", e => {
        if (e.target === popup) popup.style.display = "none";
        if (e.target === gameOverPopup) gameOverPopup.style.display = "none";
    });

    // ----------------- Start the game -----------------
    startGame();

});
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const maze = parseInt(params.get("maze") || "1");

  const nextBtn = document.querySelector(".next-btn");
  const restartBtn = document.querySelector(".restart-btn");
  const winText = document.querySelector(".Wintext");


  // ✅ Update win popup text + next button behavior
  if (maze === 1) {
    winText.textContent = "Click the button to go to the next level";
    nextBtn.onclick = () => window.location.href = "level.html?maze=2";
  } else if (maze === 2) {
    winText.textContent = "Click the button to go to the next level";
    nextBtn.onclick = () => window.location.href = "level.html?maze=3";
  } else if (maze === 3) {
    winText.textContent = "You beat the hardest level! 🎉";
    nextBtn.textContent = "Return to Homepage";
    nextBtn.onclick = () => window.location.href = "homepage.html";

  }

  // ✅ Restart button (reloads same level)
  restartBtn.onclick = () => {
    window.location.href = `level.html?maze=${maze}`;
  };
});

  document.addEventListener("DOMContentLoaded", () => {
  const countdownEl = document.getElementById("countdown");
  const countDownSound = new Audio("Sounds/robotic-countdown-43935.mp3")
  let countdown = 3;

  function startCountdown(callback) {
    countdownEl.style.display = "block";
    countdownEl.textContent = countdown;

    const timer = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        countdownEl.textContent = countdown;
      } else {
        clearInterval(timer);
        countdownEl.textContent = "GO!";
        setTimeout(() => {
          countdownEl.style.display = "none";
          callback(); // start the game
        }, 1000);
      }
    }, 1000);
  }

  // Call this to start the game after countdown
  startCountdown(() => {
    initGame(); // put your game start logic in here
});

  function initGame() {
    // all your game setup code (creating grid, stars, player, etc.)
    console.log("Game started!");
  }
});
