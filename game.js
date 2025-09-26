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
    const eatFishSound = new Audio("Sounds/Eating-Fish-Sounds.mp3");
    const eatSalmon = new Audio("Sounds/EatingSalmon.mp3");
    const eatDogs = new Audio("Sounds/Eatingdogs.mp3");
    const losingLive = new Audio("Sounds/Losing-Heart.mp3")
    const gameOverSound = new Audio("Sounds/GameOver.mp3")
    const winingGame = new Audio("Sounds/WiningSound.mp3")
    const bgMusic = new Audio("Sounds/BackgroundMusic.mp3");
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
    let catmanCurrentIndex; 
    let catmanDirection = 1; 
    let hasStartedMoving = false;
    let catmanInterval = null;   
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
        new Dog("chase", 348, 250),
        new Dog("skye", 376, 400),  
        new Dog("zuma", 351, 300), 
        new Dog("rocky", 379, 500), 
    ];


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

            if (layout[i] === 0) square.classList.add("fish"); 
            if (layout[i] === 1) square.classList.add("wall");
            if (layout[i] === 2) square.classList.add("dog-lair");
            if (layout[i] === 3) square.classList.add("salmon");
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


    function updateCatmanDirection(e) { 
    switch (e.key) {
        case "ArrowLeft": catmanDirection = -1; break; 
        case "ArrowUp": catmanDirection = -width; break;
        case "ArrowRight": catmanDirection = 1; break;
        case "ArrowDown": catmanDirection = width; break; 
        default: return;
    }

    if (!hasStartedMoving) {
        hasStartedMoving = true;
        catmanInterval = setInterval(moveCatmanContinuously, 150);

        if (bgMusic.paused) {
        bgMusic.currentTime = 0;
        bgMusic.play().catch(err => console.log("Autoplay blocked:", err));
        }

        dogs.forEach(dog => moveDog(dog));
    }
    }


    function moveCatmanContinuously() { 
        squares[catmanCurrentIndex].classList.remove("cat-man"); 

        let nextIndex = catmanCurrentIndex + catmanDirection; 

        if (
            (catmanDirection === -1 && (catmanCurrentIndex % width === 0 || squares[nextIndex].classList.contains("wall") || squares[nextIndex].classList.contains("dog-lair"))) ||
            (catmanDirection === 1 && (catmanCurrentIndex % width === width - 1 || squares[nextIndex].classList.contains("wall") || squares[nextIndex].classList.contains("dog-lair"))) ||
            (catmanDirection === -width && (catmanCurrentIndex - width < 0 || squares[nextIndex].classList.contains("wall") || squares[nextIndex].classList.contains("dog-lair"))) ||
            (catmanDirection === width && (catmanCurrentIndex + width >= width * width || squares[nextIndex].classList.contains("wall") || squares[nextIndex].classList.contains("dog-lair")))
        ) {
            squares[catmanCurrentIndex].classList.add("cat-man");
            return;
        }

        catmanCurrentIndex = nextIndex;

        if (catmanCurrentIndex - 1 === 363) catmanCurrentIndex = 391;
        if (catmanCurrentIndex + 1 === 392) catmanCurrentIndex = 364;

        squares[catmanCurrentIndex].classList.add("cat-man");

        catDotEaten();
        salmonEaten();
        checkForGameOver();
        checkForEscape();
    }


    function catDotEaten() {
        if (squares[catmanCurrentIndex].classList.contains("fish")) {
            score++;
            eatFishSound.play();
            scoreDisplay.innerHTML = score;
            squares[catmanCurrentIndex].classList.remove("fish");
        }
    }
    function salmonEaten() {
        if (squares[catmanCurrentIndex].classList.contains("salmon")) {
            score += 10;
            eatSalmon.play();
            scoreDisplay.innerHTML = score;

            dogs.forEach(dog => {
                if (!dog.isReturning) {
                    dog.isScared = true;
                    squares[dog.currentIndex].classList.add("scared-dog");
                }
            });

            const clock = document.getElementById("scared-clock");
            clock.style.display = "block";

            if (scareTimeoutId) clearTimeout(scareTimeoutId);
            if (flashTimeoutId) clearTimeout(flashTimeoutId);
            if (scareCountdownInterval) clearInterval(scareCountdownInterval);

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

        flashTimeoutId = setTimeout(() => {
            dogs.forEach(dog => {
                if (dog.isScared) {
                    squares[dog.currentIndex].classList.add("scared-dog-warning");
                }
            });
        }, 7000);

        scareTimeoutId = setTimeout(() => {
            unScareDogs();
            clock.style.display = "none"; 
        }, 10000);

        squares[catmanCurrentIndex].classList.remove("salmon");
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
    scareTimeoutId = null; 
}



    function getTarget(dog) {
        if (dog.className === "chase") {
            return catmanCurrentIndex; 
        }
        if (dog.className === "skye") {
            return catmanCurrentIndex + catmanDirection * 4;
        }
        if (dog.className === "zuma") {
            let chase = dogs.find(d => d.className === "chase");
            let ahead = catmanCurrentIndex + catmanDirection * 2;
            return ahead + (ahead - chase.currentIndex);
        }
        if (dog.className === "rocky") {
            let distance = Math.abs(dog.currentIndex - catmanCurrentIndex);
            if (distance > 8) return catmanCurrentIndex;
            return width * (width - 2); 
        }
    }

    function moveDog(dog) { 
        dog.timerId = setInterval(() => {
            if (dog.isReturning) {
                squares[dog.currentIndex].classList.remove(dog.className, "dog", "scared-dog");
                dog.currentIndex = dog.startIndex;
                squares[dog.currentIndex].classList.add(dog.className, "dog", "returning");
                return; 
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

        dogs.forEach(dog => {
            if (dog.isScared && dog.currentIndex === catmanCurrentIndex) {
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
    if (!hasStartedMoving) return;

    const dogHere = dogs.find(dog => dog.currentIndex === catmanCurrentIndex);
    if (dogHere && !dogHere.isScared && !dogHere.isReturning) {
        lives--;
        updateLives();

        if (lives > 0) {
            resetCatman();
        } else {
            gameOver();
        gameOverSound.play()

        } 

    }

    
        }


    function resetCatman() {
        if (catmanInterval) clearInterval(catmanInterval);
        hasStartedMoving = false;
        catmanDirection = 0;

        stopDogs();

        squares[catmanCurrentIndex].classList.remove("cat-man");

        catmanCurrentIndex = 29;
        squares[catmanCurrentIndex].classList.add("cat-man");

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
    document.removeEventListener("keyup", updateCatmanDirection);
    gameOverPopup.style.display = "flex";

    bgMusic.pause();
    bgMusic.currentTime = 0;

    gameOverSound.play();
    }

    function checkForEscape() {
    if (squares[catmanCurrentIndex].classList.contains("escape-door")) {
        dogs.forEach(dog => clearInterval(dog.timerId));
        document.removeEventListener("keyup", updateCatmanDirection);

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

        catmanCurrentIndex = 29;
        catmanDirection = 0; 
        squares[catmanCurrentIndex].classList.add("cat-man");

        resetDogs();

        document.addEventListener("keydown", updateCatmanDirection);

    }

        closeBtn.addEventListener("click", () => (popup.style.display = "none"));
        closeGameOverBtn.addEventListener(
            "click",
            () => (gameOverPopup.style.display = "none")
        );

        window.addEventListener("click", e => {
            if (e.target === popup) popup.style.display = "none";
            if (e.target === gameOverPopup) gameOverPopup.style.display = "none";
        });

        startGame();

    });
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const maze = parseInt(params.get("maze") || "1");

  const nextBtn = document.querySelector(".next-btn");
  const restartBtn = document.querySelector(".restart-btn");
  const winText = document.querySelector(".Wintext");


  if (maze === 1) {
    winText.textContent = "Click the button to go to the next level";
    nextBtn.onclick = () => window.location.href = "level.html?maze=2";
  } else if (maze === 2) {
    winText.textContent = "Click the button to go to the next level";
    nextBtn.onclick = () => window.location.href = "level.html?maze=3";
  } else if (maze === 3) {
    winText.textContent = "You beat the hardest level! 🎉";
    nextBtn.textContent = "Return to Homepage";
    nextBtn.onclick = () => window.location.href = "index.html";

  }

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
          callback(); 
        }, 1000);
      }
    }, 1000);
  }

  startCountdown(() => {
    initGame();
});

  function initGame() {
    console.log("Game started!");
  }
});
