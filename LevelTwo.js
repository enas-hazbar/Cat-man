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

    const eatDotSound = new Audio('Sounds/cat-eating-81278 (mp3cut.net).mp3');
    const eatPower = new Audio('Sounds/game-bonus-02-294436.mp3');
    const eatDogs = new Audio('Sounds/video-game-bonus-323603.mp3');

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
    // 2 - ghost-lair
    // 3 - power-pellet
    // 4 - empty
    // 5- escape door

    const squares = [];

    class Ghost {
        constructor(className, startIndex, speed) {
            this.className = className;
            this.startIndex = startIndex;
            this.speed = speed;
            this.currentIndex = startIndex;
            this.isScared = false;
            this.timerId = NaN;
        }
    }

    const ghosts = [
        new Ghost("blinky", 348, 250),
        new Ghost("pinky", 376, 400),
        new Ghost("inky", 351, 300),
        new Ghost("clyde", 379, 500),
    ];

    let pacmanCurrentIndex;

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
            if (layout[i] === 2) square.classList.add("ghost-lair");
            if (layout[i] === 3) square.classList.add("power-pellet");
            if (layout[i] === 5) square.classList.add("escape-door");
        }
    }

    function movePacman(e) {
        squares[pacmanCurrentIndex].classList.remove("pac-man");

        switch (e.key) {
            case "ArrowLeft":
                if (pacmanCurrentIndex % width !== 0 &&
                    !squares[pacmanCurrentIndex - 1].classList.contains("wall") &&
                    !squares[pacmanCurrentIndex - 1].classList.contains("ghost-lair")) {
                    pacmanCurrentIndex -= 1;
                }
                if (pacmanCurrentIndex - 1 === 363) pacmanCurrentIndex = 391;
                break;

            case "ArrowUp":
                if (pacmanCurrentIndex - width >= 0 &&
                    !squares[pacmanCurrentIndex - width].classList.contains("wall") &&
                    !squares[pacmanCurrentIndex - width].classList.contains("ghost-lair")) {
                    pacmanCurrentIndex -= width;
                }
                break;

            case "ArrowRight":
                if (pacmanCurrentIndex % width < width - 1 &&
                    !squares[pacmanCurrentIndex + 1].classList.contains("wall") &&
                    !squares[pacmanCurrentIndex + 1].classList.contains("ghost-lair")) {
                    pacmanCurrentIndex += 1;
                }
                if (pacmanCurrentIndex + 1 === 392) pacmanCurrentIndex = 364;
                break;

            case "ArrowDown":
                if (pacmanCurrentIndex + width < width * width &&
                    !squares[pacmanCurrentIndex + width].classList.contains("wall") &&
                    !squares[pacmanCurrentIndex + width].classList.contains("ghost-lair")) {
                    pacmanCurrentIndex += width;
                }
                break;
        }

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
            ghosts.forEach(ghost => ghost.isScared = true);
            setTimeout(unScareGhosts, 10000);
            squares[pacmanCurrentIndex].classList.remove("power-pellet");
        }
    }

    function unScareGhosts() {
        ghosts.forEach(ghost => ghost.isScared = false);
    }

    function moveGhost(ghost) {
        const directions = [-1, 1, width, -width];
        let direction = directions[Math.floor(Math.random() * directions.length)];

        ghost.timerId = setInterval(() => {
            if (!squares[ghost.currentIndex + direction].classList.contains("ghost") &&
                !squares[ghost.currentIndex + direction].classList.contains("wall")) {
                squares[ghost.currentIndex].classList.remove(ghost.className, "ghost", "scared-ghost");
                ghost.currentIndex += direction;
                squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
            } else direction = directions[Math.floor(Math.random() * directions.length)];

            if (ghost.isScared) squares[ghost.currentIndex].classList.add("scared-ghost");

            if (ghost.isScared && squares[ghost.currentIndex].classList.contains("pac-man")) {
                ghost.isScared = false;
                squares[ghost.currentIndex].classList.remove(ghost.className, "ghost", "scared-ghost");
                ghost.currentIndex = ghost.startIndex;
                score += 100;
                eatDogs.play();
                scoreDisplay.innerHTML = score;
                squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
            }

            checkForGameOver();
        }, ghost.speed);
    }

    function checkForGameOver() {
        if (squares[pacmanCurrentIndex].classList.contains("ghost") &&
            !squares[pacmanCurrentIndex].classList.contains("scared-ghost")) {
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
        ghosts.forEach(ghost => clearInterval(ghost.timerId));
        document.removeEventListener("keyup", movePacman);
        gameOverPopup.style.display = "flex";
    }

    function checkForEscape() {
        if (squares[pacmanCurrentIndex].classList.contains("escape-door")) {
            ghosts.forEach(ghost => clearInterval(ghost.timerId));
            document.removeEventListener("keyup", movePacman);

            setTimeout(() => {
                popup.style.display = "flex";
            }, 200);
        }
    }

    function startGame() {
        // Remove old squares
        squares.forEach(square => square.remove());
        squares.length = 0;

        // Hide popups
        popup.style.display = "none";
        gameOverPopup.style.display = "none";

        // Reset score & lives
        score = 0;
        lives = 3;
        updateLives();
        scoreDisplay.innerHTML = score;

        // Create board and characters
        createBoard();

        pacmanCurrentIndex = 29;
        squares[pacmanCurrentIndex].classList.add("pac-man");

        ghosts.forEach(ghost => {
            clearInterval(ghost.timerId);
            ghost.currentIndex = ghost.startIndex;
            ghost.isScared = false;
            squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
            moveGhost(ghost);
        });

        document.addEventListener("keyup", movePacman);
    }

    // ----------------- Event Listeners -----------------
    closeBtn.addEventListener("click", () => popup.style.display = "none");
    closeGameOverBtn.addEventListener("click", () => gameOverPopup.style.display = "none");
    restartBtn.addEventListener("click", startGame);
    homeBtn.addEventListener("click", () => window.location.href = "index.html");

    window.addEventListener("click", (e) => {
        if (e.target === popup) popup.style.display = "none";
        if (e.target === gameOverPopup) gameOverPopup.style.display = "none";
    });

    // ----------------- Start the game -----------------
    startGame();
});