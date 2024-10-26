const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const bestTimesList = document.getElementById('best-times');

let board = Array(9).fill(null);
let isGameOver = false;
let startTime, interval;

loadBestTimes();

cells.forEach(cell => {
  cell.addEventListener('click', () => playerMove(cell));
});

resetButton.addEventListener('click', resetGame);

function playerMove(cell) {
  const index = cell.dataset.index;
  if (board[index] || isGameOver) return;
  cell.textContent = 'X';
  board[index] = 'X';
  if (!startTime) startTimer();
  if (checkWin('X')) {
    endGame('Jugador');
  } else if (board.includes(null)) {
    computerMove();
  }
}

function computerMove() {
  if (isGameOver) return;
  const bestMove = minimax(board, 'O').index;
  makeMove(bestMove, 'O');
}

function minimax(newBoard, player) {
  const availableSpots = newBoard.map((val, idx) => (val === null ? idx : null)).filter(val => val !== null);
  if (checkWin('X')) return { score: -10 };
  if (checkWin('O')) return { score: 10 };
  if (availableSpots.length === 0) return { score: 0 };

  const moves = [];
  for (let i = 0; i < availableSpots.length; i++) {
    const move = {};
    move.index = availableSpots[i];
    newBoard[availableSpots[i]] = player;
    if (player === 'O') {
      const result = minimax(newBoard, 'X');
      move.score = result.score;
    } else {
      const result = minimax(newBoard, 'O');
      move.score = result.score;
    }
    newBoard[availableSpots[i]] = null;
    moves.push(move);
  }

  let bestMove;
  if (player === 'O') {
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

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  if (checkWin(player)) {
    endGame(player === 'X' ? 'Jugador' : 'Computadora');
  }
}

function checkWin(player) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return winPatterns.some(pattern => pattern.every(index => board[index] === player));
}

function endGame(winner) {
  isGameOver = true;
  stopTimer();
  if (winner === 'Jugador') {
    const playerName = prompt('¡Felicidades! Ingresa tu nombre:');
    saveBestTime(playerName);
  }
}

function startTimer() {
  startTime = Date.now();
  interval = setInterval(() => {
    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
    document.title = `Tiempo: ${elapsedTime}s`;
  }, 100);
}

function stopTimer() {
  clearInterval(interval);
}

function resetGame() {
  board.fill(null);
  cells.forEach(cell => cell.textContent = '');
  isGameOver = false;
  startTime = null;
  stopTimer();
  document.title = 'Tic-Tac-Toe';
}

function saveBestTime(playerName) {
  const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
  const record = { name: playerName, time: parseFloat(elapsedTime), date: new Date().toLocaleString() };
  let bestTimes = JSON.parse(localStorage.getItem('bestTimes')) || [];
  bestTimes.push(record);
  bestTimes.sort((a, b) => a.time - b.time);
  bestTimes = bestTimes.slice(0, 10);
  localStorage.setItem('bestTimes', JSON.stringify(bestTimes));
  loadBestTimes();
}

function loadBestTimes() {
  const bestTimes = JSON.parse(localStorage.getItem('bestTimes')) || [];
  bestTimesList.innerHTML = bestTimes.map(record =>
    `<li>${record.name} - ${record.time}s (${record.date})</li>`
  ).join('');
}

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  document.querySelectorAll('.cell').forEach(cell => {
    cell.style.backgroundColor = getRandomColor();
  });
  