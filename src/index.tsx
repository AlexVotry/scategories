import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';

// import Letter from './components/Letter';
// import CategoryList from './components/CategoryList';
// import Timer from './components/Timer';
import OpeningPage from './components/OpeningPage';
import TeamPlayers from './components/TeamPlayers';
import {Letters} from './data/letters';
import {getLetter, getCategories} from './service/randomize';
import {categoryList} from './data/categoryList';
import LetterContext from './contexts/LetterContext';
import CategoryContext from './contexts/CategoryContext';
import ButtonContext from './contexts/ButtonContext';
import TimerContext from './contexts/TimerContext';


export default function Index(): JSX.Element {
  const arrayString: string[] = [];
  const [letters, setLetters] = useState(Letters);
  const [currentLetter, setCurrentLetter] = useState('');
  const [categories, setCategories] = useState(categoryList);
  const [currentList, setCurrentList] = useState(arrayString);
  const [counter, setCounter] = useState(60);
  const [gameState, setGameState] = useState<'running' | 'paused' | 'ready'>('ready');
  const buttons = {
    resetEverything,
    startGame,
    stopGame
  }

  function resetEverything () {
    setGameState('ready');
    const result = getLetter(letters);
    const cats = getCategories(categories, 6);
    setCurrentLetter(result[0]);
    setLetters(result[1]);
    setCurrentList(cats[0]);
    setCategories(cats[1])
    setCounter(60);
  }
  
  function startGame () {
    if (gameState === 'ready') {
      resetEverything();
    }
      setGameState('running');
  }

  function stopGame () {
    setGameState('paused');
  }

  useEffect(() => {
   if (counter > 0 && gameState === 'running') {
     setTimeout(() => setCounter(counter - 1), 1000);
   } else if (gameState === 'ready') {
     setCounter(60);
   } else if(counter === 0) {
     setGameState('ready');
   }

  }, [counter, gameState]);

  const showCorrectPage = () => {
    return gameState == 'running' ? <TeamPlayers /> : <OpeningPage />;
  }

  return (
    <>
      <LetterContext.Provider value = {currentLetter}>
      <CategoryContext.Provider value = {currentList}>
      <TimerContext.Provider value = {counter}>
      <ButtonContext.Provider value = {buttons}>
        {showCorrectPage()}
      </ButtonContext.Provider>
      </TimerContext.Provider>
      </CategoryContext.Provider>
      </LetterContext.Provider>
    </>
  )
}

ReactDOM.render(<Index />, document.getElementById('root'));