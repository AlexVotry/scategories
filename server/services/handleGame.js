const letter = require('../data/alphabet');
const categories = require('../data/scattegories');
const { getLetter, getCategories} = require('./randomize');

let totalTime = 0;
let ticker;
let middleOfGame = false;
let scattegories = categories;
let letters = letter;

function handleGame(io, room, timer, numOfCategories, gameState) {
  setUpNewGame(io, room, numOfCategories, gameState);
  if (gameState === 'running') startGame(io, room, timer);
  else if (gameState === 'pause') pauseGame();
  else if (gameState === "resetRound" || gameState === 'startOver') resetGame(timer);
}

function startGame(io, room, timer) {
  middleOfGame = true;
  pauseGame();
  if (totalTime === 0) totalTime = timer;
  ticker = setInterval(() => {
      if (totalTime > 0) {
      totalTime--;
      io.to(room).emit('Clock', totalTime);
    } else {
      io.to(room).emit('gameState', 'ready');
    }
  }, 1000);
}

function pauseGame() {
  clearInterval(ticker);
}

function resetGame(timer) {
  clearInterval(ticker);
  totalTime = timer;
  middleOfGame = false;
}

function setUpNewGame(io, room, numOfCategories, gameState) {
  if (!middleOfGame && gameState === 'running') {
    const letterArr = getLetter(letters);
    letters = letterArr[1];

    const currentLetter = letterArr[0];
    catArr = getCategories(scattegories, numOfCategories);
    scattegories = catArr[1];

    const categories = catArr[0];
    const gameInfo = { currentLetter, categories };
    io.to(room).emit('newGame', gameInfo);
  }
}

module.exports = { handleGame, pauseGame, resetGame };