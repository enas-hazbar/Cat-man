document.addEventListener("DOMContentLoaded", () => {
    const scoreDisplay = document.getElementById("score");
    const livesDisplay = document.getElementById("lives");
    const grid = document.querySelector(".grid");
    const width = 28;

    const popup = document.getElementById("popup1");
    const closeBtn = document.querySelector(".close");

    const gameOverPopup = document.getElementById("gameOverPopup");
    const closeGameOverBtn = document.querySelector(".close-gameover");
    const restartBtn = document.querySelector(".restart-btn");
    const homeBtn = document.querySelector(".home-btn");

    const eatDotSound = new Audio("Sounds/cat-eating-81278 (mp3cut.net).mp3");
    const eatPower = new Audio("Sounds/game-bonus-02-294436.mp3");
    const eatDogs = new Audio("Sounds/video-game-bonus-323603.mp3");

    let score = 0;
    let lives = 3;
    //medium mode
    const layout = [
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1,
            1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 1, 4, 1, 0, 1, 1, 1, 3, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 4, 1, 0, 0, 1,
            1, 0, 1, 1, 1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 1, 1, 1, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 1,
            1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1,
            1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
            1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1,
            1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1,
            1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 0, 1,
            1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
            1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1,
            1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 1, 4, 1, 0, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 5, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            ];
     // 0 - pac-dots
    // 1 - wall
    // 2 - Dog-lair
    // 3 - power-pellet
    // 4 - empty
    // 5- escape door

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

    let pacmanCurrentIndex;
    let pacmanDirection = 1; // store current direction

    // ----------------- Functions -----------------
    function updateLives() {
        livesDisplay.innerHTML = "Lives: ";
        for (let i = 0; i < lives; i++) {
            livesDisplay.innerHTML += "❤️";
        }
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

function updatePacmanDirection(e) {
    switch (e.key) {
        case "ArrowLeft":
            pacmanDirection = -1;
            break;
        case "ArrowUp":
            pacmanDirection = -width;
            break;
        case "ArrowRight":
            pacmanDirection = 1;
            break;
        case "ArrowDown":
            pacmanDirection = width;
            break;
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
            dogs.forEach(dog => (dog.isScared = true));
            setTimeout(unScareDogs, 10000);
            squares[pacmanCurrentIndex].classList.remove("power-pellet");
        }
    }

function unScareDogs() {
    dogs.forEach(dog => {
        dog.isScared = false;
        if (dog.isReturning) {
            dog.isReturning = false; // 👀 allowed to leave lair again
            squares[dog.currentIndex].classList.remove("scared-dog", "returning");
        }
    });
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
        const directions = [-1, 1, width, -width];
        let direction = directions[Math.floor(Math.random() * directions.length)];

dog.timerId = setInterval(() => {
    const directions = [-1, 1, width, -width];
    let target = getTarget(dog);

    let bestDirection = directions[0];
    let shortestDistance = Infinity;

    directions.forEach(dir => {
        let nextIndex = dog.currentIndex + dir;
        if (
            !squares[nextIndex].classList.contains("wall") &&
            !squares[nextIndex].classList.contains("dog-lair") &&
            !squares[nextIndex].classList.contains("dog") // 🚫 no stacking
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

    // remove old position
    squares[dog.currentIndex].classList.remove(dog.className, "dog", "scared-dog");

    // update position
    dog.currentIndex += bestDirection;
    squares[dog.currentIndex].classList.add(dog.className, "dog");

    // scared state
    if (dog.isScared) {
        squares[dog.currentIndex].classList.add("scared-dog");
    }

    // eaten by pacman
if (dog.isScared && squares[dog.currentIndex].classList.contains("pac-man")) {
    dog.isScared = false;
    dog.isReturning = true; // 👀 returning state
    squares[dog.currentIndex].classList.remove(dog.className, "dog", "scared-dog");
    dog.currentIndex = dog.startIndex; // back to lair
    score += 100;
    eatDogs.play();
    scoreDisplay.innerHTML = score;
    squares[dog.currentIndex].classList.add(dog.className, "dog", "returning");
}


    checkForGameOver();
}, dog.speed);
    }
    function checkForGameOver() {
        if (
            squares[pacmanCurrentIndex].classList.contains("dog") &&
            !squares[pacmanCurrentIndex].classList.contains("scared-dog")
        ) {
            lives--;
            updateLives();

            if (lives > 0) {
                squares[pacmanCurrentIndex].classList.remove("pac-man");
                pacmanCurrentIndex = 29;
                squares[pacmanCurrentIndex].classList.add("pac-man");
            } else {
                gameOver();
            }
        }
    }

    function gameOver() {
        dogs.forEach(dog => clearInterval(dog.timerId));
        document.removeEventListener("keyup", updatePacmanDirection);
        gameOverPopup.style.display = "flex";
    }

    function checkForEscape() {
        if (squares[pacmanCurrentIndex].classList.contains("escape-door")) {
            dogs.forEach(dog => clearInterval(dog.timerId));
            document.removeEventListener("keyup", updatePacmanDirection);

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
        pacmanDirection = 1;
        squares[pacmanCurrentIndex].classList.add("pac-man");

        dogs.forEach(dog => {
            clearInterval(dog.timerId);
            dog.currentIndex = dog.startIndex;
            dog.isScared = false;
            squares[dog.currentIndex].classList.add(dog.className, "dog");
            moveDog(dog);
        });

document.addEventListener("keydown", updatePacmanDirection);

// Move Pac-Man every 150ms in the current direction
setInterval(movePacmanContinuously, 150);
    }

    // ----------------- Event Listeners -----------------
    closeBtn.addEventListener("click", () => (popup.style.display = "none"));
    closeGameOverBtn.addEventListener(
        "click",
        () => (gameOverPopup.style.display = "none")
    );
    restartBtn.addEventListener("click", startGame);
    homeBtn.addEventListener("click", () => (window.location.href = "index.html"));

    window.addEventListener("click", e => {
        if (e.target === popup) popup.style.display = "none";
        if (e.target === gameOverPopup) gameOverPopup.style.display = "none";
    });

    // ----------------- Start the game -----------------
    startGame();
});