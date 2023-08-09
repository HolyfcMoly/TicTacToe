window.addEventListener("DOMContentLoaded", () => {
    const statusDisplay = document.querySelector(".game--status");
    let gameActive = true;
    let currentPlayer = "X";
    let gameState = ["", "", "", "", "", "", "", "", ""];

    const winningMessage = () => `Player ${currentPlayer} has won!`;
    const drawMessage = () => `Game ended in a draw!`;
    const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

    const cols = document.querySelectorAll(".cell");
    const close = document.querySelectorAll(".close");
    const circle = document.querySelectorAll(".circle");
    const reset = document.querySelector(".game--restart");
    let animationId;

    statusDisplay.innerHTML = currentPlayerTurn();

    function handleCellPlayed(clickedCell, clickedCellIndex) {
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.innerHTML = currentPlayer;
    }
    
    function changedPlayer() {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusDisplay.innerHTML = currentPlayerTurn();
    }
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    function checkWin() {
        let roundWon = false;
        let win = null;
        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            const [a, b, c] = winCondition.map((i) => gameState[i]);
            if (a === "" || b === "" || c === "") {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                win = winCondition;
                break;
            }
        }
        if (roundWon) {
            statusDisplay.innerHTML = winningMessage();
            gameActive = false;
            cols.forEach((cell) => {
                const cellIndex = parseInt(
                    cell.getAttribute("data-cell-index")
                );
                if (win.includes(cellIndex)) {
                    scaleElem(cell, 1.05, 1000, 345, 386);
                }
            });
            if (currentPlayer === "O") {
                close.forEach((item, index) => {
                    item.classList.add("active-circle");
                    let duration = 5000 + 500 * index;
                    translateElem(item, 160, -88, 130, duration, 1.7);
                });
                circle.forEach((item, index) => {
                    let duration = 5000 + 500 * index;
                    translateElem(item, 160, -88, 130, duration, 1.7);
                });
            } else {
                circle.forEach((item, index) => {
                    item.classList.add("active-close");
                    let duration = 5000 + 500 * index;
                    translateElem(item, 160, -88, 130, duration, 1.7);
                });
                close.forEach((item, index) => {
                    let duration = 5000 + 500 * index;
                    translateElem(item, 160, -88, 130, duration, 1.7);
                });
            }
        } else if (!gameState.includes("")) {
            statusDisplay.innerHTML = drawMessage();
            gameActive = false;
        } else {
            changedPlayer();
        }
    }

    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(
            clickedCell.getAttribute("data-cell-index")
        );

        if (gameState[clickedCellIndex] !== "" || !gameActive) {
            return;
        }
        

        handleCellPlayed(clickedCell, clickedCellIndex);
        checkWin();
        if (currentPlayer === "O" && gameActive) {
            setTimeout(() => {
                botMove();
            },500)
        }
    }

    function resetGame() {
        gameActive = true;
        currentPlayer = "X";
        gameState = ["", "", "", "", "", "", "", "", ""];
        close.forEach((item, index) => {
            let duration = 5000 + 500 * index;
            item.classList.remove("active-circle");
            translateElem(item, 160, -88, 130, duration);
        });
        circle.forEach((item, index) => {
            let duration = 5000 + 500 * index;
            item.classList.remove("active-close");
            translateElem(item, 160, -88, 130, duration);
        });
        statusDisplay.innerHTML = currentPlayerTurn();
        cols.forEach((cell) => {
            cell.innerHTML = "";
            for (let i = 0; i <= animationId; i++) {
                cancelAnimationFrame(i);
            }
            cell.style.transform = "";
            cell.style.filter = "";
        });
    }

    function botMove() {
        let availableMoves = [];
        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] === "") {
                availableMoves.push(i);
            }
        }
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        const selectedSquare = availableMoves[randomIndex];
        gameState[selectedSquare] = "O";
        cols[selectedSquare].innerHTML = currentPlayer;
        
        if(checkWin && currentPlayer === 'O') {
            checkWin();
        } else {
            currentPlayer = "X";
        }
    }
    /////////// ANIMATION ////////////////
    function scaleElem(
        element,
        scale,
        duration,
        minValue,
        maxValue
    ) {
        let start = null;
        let reverse = false;

        function step(timestamp) {
            if (!start) {
                start = timestamp;
            }

            const progress = timestamp - start;
            let scaleProgress = progress / duration;
            let filterProgress = progress / duration;
            if (reverse) {
                scaleProgress = 1 - scaleProgress;
                filterProgress = 1 - filterProgress;
            }

            const scaleValue = scaleProgress * (scale - 1) + 1;
            const filterValue = Math.min(
                Math.max(
                    filterProgress * (maxValue - minValue) + minValue,
                    minValue
                ),
                maxValue
            );

            element.style.filter = `hue-rotate(${filterValue}deg)`;
            element.style.transform = `scale(${scaleValue})`;
            if (progress < duration) {
                animationId = requestAnimationFrame(step);
            } else {
                reverse = !reverse;
                start = null;
                animationId = requestAnimationFrame(step);
            }
        }
        animationId = requestAnimationFrame(step);
    }

    function translateElem(element, axisZ, axisY, axisX, duration, scale = 1) {
        let start = null;
        let reverse = false;
        function step(timestamp) {
            if (!start) {
                start = timestamp;
            }

            const progress = timestamp - start;
            let opacityProgress = 0;
            let transformProgress = progress / duration;
            let scaleProgress = progress / duration;

            if (progress <= duration / 3.2) {
                opacityProgress = (progress / (duration / 2)) * 0.5;
                scaleProgress = (progress / (duration / 2)) * 1.5;
            } else {
                opacityProgress = (1 - progress / duration) * 0.5;
                scaleProgress = (1 - progress / duration) * 1.5;
            }
            const scaleValue = scaleProgress * (scale - 1) + 1;

            if (reverse) {
                opacityProgress = opacityProgress;
                transformProgress = 1 - transformProgress;
                scaleProgress = 1 - scaleProgress;
            }

            element.style.opacity = opacityProgress;
            element.style.transform = `translateZ(${
                axisZ * transformProgress
            }px) translateY(${axisY * transformProgress}px) translateX(${
                axisX * transformProgress
            }px) scale(${scaleValue})`;
            if (progress < duration) {
                window.requestAnimationFrame(step);
            } else {
                reverse = !reverse;
                start = null;
                window.requestAnimationFrame(step);
            }
        }
        window.requestAnimationFrame(step);
    }
    /////////////////////////////
    close.forEach((item, index) => {
        let duration = 5000 + 500 * index;
        translateElem(item, 160, -88, 130, duration);
    });
    circle.forEach((item, index) => {
        let duration = 5000 + 500 * index;
        translateElem(item, 160, -88, 130, duration);
    });

    cols.forEach((cell) => cell.addEventListener("click", handleCellClick));
    reset.addEventListener("click", resetGame);
});
