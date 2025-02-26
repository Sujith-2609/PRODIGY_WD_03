const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector(".status");
const resetButton = document.querySelector(".reset");
const gameModeSelect = document.querySelector("#gameMode");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = true;
let gameMode = "normal"; // Default mode is Player vs Player

const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8], 
    [0,3,6], [1,4,7], [2,5,8], 
    [0,4,8], [2,4,6]
];

function initializeGame() {
    cells.forEach(cell => cell.addEventListener("click", handleMove));
    resetButton.addEventListener("click", restartGame);
    gameModeSelect.addEventListener("change", changeMode);
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

function handleMove() {
    const index = this.getAttribute("data-index");

    if (board[index] !== "" || !running) return;

    board[index] = currentPlayer;
    this.textContent = currentPlayer;

    checkWinner();

    if (gameMode === "ai" && running && currentPlayer === "O") {
        setTimeout(AIMove, 500); // AI makes its move after a delay
    }
}

function AIMove() {
    let bestMove = minimax(board, "O").index;
    board[bestMove] = "O";
    cells[bestMove].textContent = "O";

    checkWinner();
}

function checkWinner() {
    let roundWon = false;

    for (let i = 0; i < winPatterns.length; i++) {
        const [a, b, c] = winPatterns[i];

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `Player ${currentPlayer} Wins!`;
        running = false;
    } else if (!board.includes("")) {
        statusText.textContent = "It's a Draw!";
        running = false;
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

// Minimax Algorithm for AI
function minimax(newBoard, player) {
    let emptySpots = newBoard.map((cell, index) => (cell === "" ? index : null)).filter(x => x !== null);

    if (checkWin(newBoard, "X")) return { score: -10 };
    if (checkWin(newBoard, "O")) return { score: 10 };
    if (emptySpots.length === 0) return { score: 0 };

    let moves = [];

    for (let i of emptySpots) {
        let move = {};
        move.index = i;
        newBoard[i] = player;

        if (player === "O") {
            move.score = minimax(newBoard, "X").score;
        } else {
            move.score = minimax(newBoard, "O").score;
        }

        newBoard[i] = "";
        moves.push(move);
    }

    let bestMove = 0;
    if (player === "O") {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}

function checkWin(board, player) {
    return winPatterns.some(pattern => pattern.every(index => board[index] === player));
}

function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    running = true;
    statusText.textContent = `Player ${currentPlayer}'s Turn`;

    cells.forEach(cell => (cell.textContent = ""));
}

function changeMode() {
    gameMode = gameModeSelect.value;
    restartGame();
}

initializeGame();
