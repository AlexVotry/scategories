const letter = require('../data/alphabet');
const categories = require('../data/scattegories');
const { getLetter, getCategories} = require('./randomize');

let scattegories = categories;
let letters = letter;
let numOfCategories = 6;

async function handleGame(io, socket, room, gameState, clock) {
  let counter = clock;
  if (gameState === 'pause') {
    console.log('pause game')
    // io.to(room).emit('gameState')
    return;
  }
  if (counter > 0 && gameState === 'running') {
    const letterArr = getLetter(letters);
    letters = letterArr[1];
    const currentLetter = letterArr[0];
    catArr = getCategories(scattegories, numOfCategories);
    scattegories = catArr[1];
    const categories = catArr[0];
    const gameInfo = { currentLetter, categories};
    io.to(room).emit('newGame', gameInfo);
    // counter = await runClock(counter, socket, io, room, gameState);
  } else {
    counter = clock;
    io.to(room).emit('gameState', gameState);
  } 
}

function runClock(counter, socket, io, room, currState) {
  let state = currState;
  // console.log('state:', state);
  // socket.on('pushPause', gameState => {
  //   state = gameState;
  //   console.log('runclock')
  //   return handleGame(io, socket, room, gameState, counter);
  // });

  if (state === 'running') {
    if (counter >= 0) {
      io.to(room).emit('Clock', counter);
    } else {
      return handleGame(io, socket, room, 'ready', counter);
    }
    counter--;
    setTimeout(() => {
      runClock(counter, socket, io, room, state);
    }, 1000);
  } else {
    return;
  }
 
}

  // function resetEverything() {
  //   // setGameState('ready');
  //   const result = getLetter(letters);
  //   const cats = getCategories(categories, 6);
  //   setCurrentLetter(result[0]);
  //   setLetters(result[1]);
  //   setCurrentList(cats[0]);
  //   setCategories(cats[1])
  //   setCounter(60);
  // }

module.exports = handleGame;