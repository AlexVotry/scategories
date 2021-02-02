const letter = require('../data/alphabet');
const categories = require('../data/scattegories');
const { getLetter, getCategories} = require('./randomize');

let scattegories = categories;
let letters = letter;

async function handleGame(io, socket, room, gameState, clock, numOfCategories) {
  let timer = clock;
  if (gameState === 'pause') {
    console.log('pause game')
    // io.to(room).emit('gameState')
    return;
  }
  if (timer > 0 && gameState === 'running') {
    const letterArr = getLetter(letters);
    letters = letterArr[1];
    const currentLetter = letterArr[0];
    catArr = getCategories(scattegories, numOfCategories);
    scattegories = catArr[1];
    const categories = catArr[0];
    const gameInfo = { currentLetter, categories};
    io.to(room).emit('newGame', gameInfo);
    timer = await runClock(timer, socket, io, room, gameState);
  } else {
    timer = clock;
    io.to(room).emit('gameState', gameState);
  } 
}

function runClock(timer, socket, io, room, currState) {
  let state = currState;
  // console.log('state:', state);
  // socket.on('pushPause', gameState => {
  //   state = gameState;
  //   console.log('runclock')
  //   return handleGame(io, socket, room, gameState, timer);
  // });

  if (state === 'running') {
    if (timer >= 0) {
      io.to(room).emit('Clock', timer);
    } else {
      return handleGame(io, socket, room, 'ready', timer);
    }
    timer--;
    setTimeout(() => {
      runClock(timer, socket, io, room, state);
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