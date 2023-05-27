window.addEventListener('DOMContentLoaded', () => {

    const statusDisplay = document.querySelector(".game--status");
    let gameActive = true;
    let currentPlayer = "X";
    let gameState = ["", "", "", "", "", "", "", "", ""];
    const winningMessage = () => `Player ${currentPlayer} has won!`;
    const drawMessage = () => `Game ended in a draw!`;
    const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;
    const cols = document.querySelectorAll(".cell");
    const close = document.querySelectorAll('.close');
    const circle = document.querySelectorAll('.circle');
    
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
            const [a, b, c] = winCondition.map(i => gameState[i]);
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
            cols.forEach(cell => {
            const CellIndex = parseInt(cell.getAttribute("data-cell-index"));
                if(win.includes(CellIndex)) {
                    cell.classList.add('win')
                }
                if(currentPlayer === 'O') {
                    close.forEach(item => {
                        item.classList.add('active-circle')
                    })
                } else {
                    circle.forEach(item => {
                        item.classList.add('active-close')
                    })
                }
            })
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
        const clickedCellIndex = parseInt(clickedCell.getAttribute("data-cell-index"));
    
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
        close.forEach(item => item.classList.remove('active-circle'));
        circle.forEach(item => item.classList.remove('active-close'))
        statusDisplay.innerHTML = currentPlayerTurn();
        cols.forEach((cell) => {
            cell.innerHTML = "";
            cell.classList.remove("win");
        });
    }

    function scaleElem(element, scale, duration) {
        let start = null;
        let reverse = false;
        function step(timestamp) {
            if(!start) {
                start = timestamp;
            }

            const progress = timestamp - start;
            let scaleProgress = progress / duration;
            if(reverse) {
                scaleProgress = 1 - scaleProgress
            }

            const scaleValue = (scaleProgress * (scale - 1) + 1)
            element.style.transform = `scale(${scaleValue})`;
            if(progress < duration) {
                window.requestAnimationFrame(step)
            } else {
                reverse = !reverse
                start = null;
                window.requestAnimationFrame(step)
            }
        }
        window.requestAnimationFrame(step)
    }

    
    
    cols.forEach((cell) => cell.addEventListener("click", handleCellClick));
    document
        .querySelector(".game--restart")
        .addEventListener("click", resetGame);
})
