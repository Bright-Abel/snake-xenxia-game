const gamePanel = document.querySelector('#canvas');
const canContext = gamePanel.getContext('2d');
const scoreVal = document.querySelector('#scoreVal');
const resetBtn = document.querySelector('#resetBtn');
const para = document.querySelector('.highScore');
const myScr = document.querySelector('.myScr');

const gameWidth = gamePanel.width;
const gameHeight = gamePanel.height;

const btnContainer = document.querySelector('.btn-container');

// ALL CHARACTERS COLOR

const panelBgColor = '#1b1b32';
const snakeColor = '#0f0';
const snakeBorder = '#000';
const foodColor = '#f1f5f8';

const unitSize = 20;
let running = false;
let scoreData = true;

function showHigScore() {
  let scoreResult = getLocalStorage();
  if (scoreResult && scoreResult.length > 0) {
    let maxScr = scoreResult[0].scr;
    for (let i = 1; i < scoreResult.length; i++) {
      if (scoreResult[i].scr > maxScr) {
        maxScr = scoreResult[i].scr;
      }
    }
    myScr.textContent = 'New High Score';
    para.textContent = maxScr;
  } else {
    myScr.textContent = 'Play the game to set your high score';
    para.textContent = '0';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  let scoreResult = getLocalStorage();
  if (scoreResult && scoreResult.length > 0) {
    let maxScr = scoreResult[0].scr;
    for (let i = 1; i < scoreResult.length; i++) {
      if (scoreResult[i].scr > maxScr) {
        maxScr = scoreResult[i].scr;
      }
    }
    myScr.textContent = 'Your High Score';
    para.textContent = maxScr;
  } else {
    myScr.textContent = 'Play the game to set your high score';
    para.textContent = '0';
  }
});

// MOVEMENT COORDINATE

let xVelocity = unitSize;
let yVelocity = 0;

// FOOD COORDINATE

let foodX;
let foodY;

// game level
let level;
// let score;
let score = 0;

let snake = [
  { x: unitSize * 3, y: 0 },
  { x: unitSize * 2, y: 0 },
  { x: unitSize, y: 0 },
  { x: 0, y: 0 },
];

speedLvl();
resetBtn.classList.add('hide-container');

function speedLvl() {
  btnContainer.addEventListener('click', (e) => {
    let btns = e.target.dataset.id;
    if (btns == 'medium') {
      level = 150;
    } else if (btns == 'hard') {
      level = 75;
    } else {
      level = 250;
    }
    initializeGame(level);
    btnContainer.classList.add('hide-container');
  });
}

// initializeGame(level)

let arr;

window.addEventListener('keydown', changeDirection);
resetBtn.addEventListener('click', resetGame);

function initializeGame(level) {
  running = true;
  scoreVal.textContent = score;
  createFood();
  drawFood();
  nextTick(level);
}

function nextTick(lvl) {
  if (running) {
    setTimeout(() => {
      clearPanel();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameOver();
      nextTick(lvl);
    }, lvl);
  } else {
    displayGameOver();
    showHigScore();
  }
}

function clearPanel() {
  canContext.fillStyle = panelBgColor;
  canContext.fillRect(0, 0, gameWidth, gameHeight);
}

function createFood() {
  function randomFood(min, max) {
    const randNumb =
      Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    return randNumb;
  }
  foodX = randomFood(0, gameWidth - unitSize);
  foodY = randomFood(0, gameWidth - unitSize);
}

function drawFood() {
  canContext.fillStyle = foodColor;
  canContext.fillRect(foodX, foodY, unitSize, unitSize);
}

function moveSnake() {
  const head = {
    x: snake[0].x + xVelocity,
    y: snake[0].y + yVelocity,
  };
  snake.unshift(head);

  if (snake[0].x == foodX && snake[0].y == foodY) {
    score += 1;
    scoreVal.textContent = score;
    let items = getLocalStorage();
    if (items && items.length > 0) {
      // showHigScore();
      for (let i = 0; i < items.length; i++) {
        if (i > score && scoreData) {
          scoreData = false;
          // return
        } else if (i < score && !scoreData) {
          scoreData = true;
        }
      }
    }

    if (score > 20 && scoreData) {
      saveScore(score);
    }
    createFood();
  } else {
    snake.pop();
  }
}

function drawSnake() {
  canContext.fillStyle = snakeColor;
  canContext.strokeStyle = snakeBorder;
  snake.forEach((snakePart) => {
    canContext.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    canContext.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
  });
}

function changeDirection(e) {
  const keyEnter = e.keyCode;
  const leftArrow = 37;
  const upArrow = 38;
  const rightArrow = 39;
  const downArrow = 40;

  // CHECKING SNAKE CURRENT DIRECTION

  const goingUp = yVelocity == -unitSize;
  const goingDown = yVelocity == unitSize;
  const goingLeft = xVelocity == -unitSize;
  const goingRight = xVelocity == unitSize;

  switch (true) {
    case keyEnter == leftArrow && !goingRight:
      xVelocity = -unitSize;
      yVelocity = 0;
      break;
    case keyEnter == rightArrow && !goingLeft:
      xVelocity = unitSize;
      yVelocity = 0;
      break;
    case keyEnter == upArrow && !goingDown:
      xVelocity = 0;
      yVelocity = -unitSize;
      break;
    case keyEnter == downArrow && !goingUp:
      xVelocity = 0;
      yVelocity = unitSize;
      break;
  }
}

function checkGameOver() {
  switch (true) {
    case snake[0].x < 0:
      running = false;
      break;
    case snake[0].x >= gameWidth:
      running = false;
      break;
    case snake[0].y < 0:
      running = false;
      break;
    case snake[0].y >= gameHeight:
      running = false;
      break;
  }
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      running = false;
    }
  }
}

function displayGameOver() {
  canContext.font = '2rem cursive';
  canContext.fillStyle = 'red';
  canContext.textAlign = 'center';
  canContext.fillText('GAME OVER!!!!', gameWidth / 2, gameHeight / 2);
  running = false;
  resetBtn.classList.remove('hide-container');
}

function saveScore(scr) {
  let scor = { scr };
  let items = getLocalStorage();
  items.push(scor);

  localStorage.setItem('score', JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem('score')
    ? JSON.parse(localStorage.getItem('score'))
    : [];
}

function resetGame() {
  window.location.reload();
  // xVelocity = unitSize;
  // yVelocity = 0;
  // score = 0;
  // snake = [
  //     { x: unitSize * 3, y: 0 },
  //     { x: unitSize * 2, y: 0 },
  //     { x: unitSize, y: 0 },
  //     { x: 0, y: 0 }
  // ];
  // speedLvl()

  // initializeGame()
}
