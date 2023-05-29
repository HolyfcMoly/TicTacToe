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
                const CellIndex = parseInt(
                    cell.getAttribute("data-cell-index")
                );
                if (win.includes(CellIndex)) {
                    scaleElem(cell, 1.05, 1000, getRandomInt(10, 200)); 
                }
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
            });
            return;
        }
        let roundDraw = !gameState.includes("");
        if (roundDraw) {
            statusDisplay.innerHTML = drawMessage();
            gameActive = false;
            return;
        }

        changedPlayer();
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
    }

    function resetGame() {
        gameActive = true;
        currentPlayer = "X";
        gameState = ["", "", "", "", "", "", "", "", ""];
        close.forEach((item) => item.classList.remove("active-circle"));
        circle.forEach((item) => item.classList.remove("active-close"));
        statusDisplay.innerHTML = currentPlayerTurn();
        cols.forEach((cell) => {
            cell.innerHTML = "";
            cell.style.transform = '';
            cell.style.filter = '';
            scaleElem(cell, 1, 0)
        });
        close.forEach((item, index) => {
            let duration = 5000 + 500 * index;
            translateElem(item, 160, -88, 130, duration);
        });
        circle.forEach((item, index) => {
            let duration = 5000 + 500 * index;
            translateElem(item, 160, -88, 130, duration);
        });
    }
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function scaleElem(element, scale, duration, filter ='none') {
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
                filterProgress = 1 - filterProgress
            }

            const scaleValue = scaleProgress * (scale - 1) + 1; 
            const filterValue = filter === 'none' ? 'none' : Math.min(Math.max(filterProgress * (386 - 345) + 345, 345), 386);
            element.style.filter = `hue-rotate(${filterValue}deg)`
            element.style.transform = `scale(${scaleValue})`;
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
                opacityProgress = (progress / (duration / 2)) * 0.2;
                scaleProgress = (progress / (duration / 2) * 1)
            } else {
                opacityProgress = (1 - progress / duration) * 0.2;
                scaleProgress = (1 - progress / duration) * 1;

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

    close.forEach((item, index) => {
        let duration = 5000 + 500 * index;
        translateElem(item, 160, -88, 130, duration);
    });
    circle.forEach((item, index) => {
        let duration = 5000 + 500 * index;
        translateElem(item, 160, -88, 130, duration);
    });

    cols.forEach((cell) => cell.addEventListener("click", handleCellClick));
    document
        .querySelector(".game--restart")
        .addEventListener("click", resetGame);
});
