import React, {useEffect, useContext, useState} from 'react';

import OpeningPage from '../OpeningPage';
import TeamPlayers from '../TeamPlayers';
import { Letters } from '../../data/letters';
import { getLetter, getCategories } from '../../service/randomize';
import { categoryList } from '../../data/categoryList';
import LetterContext from '../../contexts/LetterContext';
import CategoryContext from '../../contexts/CategoryContext';
import ButtonContext from '../../contexts/ButtonContext';
import TimerContext from '../../contexts/TimerContext';
// import TeamsContext from '../../contexts/TeamsContext';
// import UserContext from '../../contexts/UserContext';
import socket from '../../service/socketConnection';

import { assignTeam } from '../../service/parseTeams';


function App({gameState}): JSX.Element {
  const arrayString: string[] = [];
  const [letters, setLetters] = useState(Letters);
  const [currentLetter, setCurrentLetter] = useState('');
  const [categories, setCategories] = useState(categoryList);
  const [currentList, setCurrentList] = useState(arrayString);
  // const [list, setList] = useState({});
  // const [user, setUser] = useState<UserType>({});
  const [counter, setCounter] = useState(60);
  // let [gameState, setGameState] = useState(props.gameState);
  // const [gameState, setGameState] = useState<'running' | 'paused' | 'ready'>('ready');
  const buttons = {
    resetEverything,
    startGame,
    stopGame,
    createTeams
  };
  // const update = data => setUser(data);
  // const userInfo = {user, update};

  function resetEverything() {
    // setGameState('ready');
    const result = getLetter(letters);
    const cats = getCategories(categories, 6);
    setCurrentLetter(result[0]);
    setLetters(result[1]);
    setCurrentList(cats[0]);
    setCategories(cats[1])
    setCounter(60);
  }

  function startGame() {
    if (gameState === 'ready') {
      resetEverything();
    }
    // setGameState('running');
  }

  function stopGame() {
    // setGameState('paused');
  }

  function createTeams() {
    socket.emit('createTeams', true);
  }

  useEffect(() => {
    if (counter > 0 && gameState === 'running') {
      setTimeout(() => setCounter(counter - 1), 1000);
    } else if (gameState === 'ready') {
      setCounter(60);
    } else if (counter === 0) {
      // gameState = 'ready';
      // setGameState('ready');
    }
  }, [counter, gameState]);

  const showCorrectPage = () => {
    console.log('show currnt page:', gameState)
    return gameState == 'running' ? <TeamPlayers /> : <OpeningPage />;
  }

  return (
    <>
      <LetterContext.Provider value={currentLetter}>
        <CategoryContext.Provider value={currentList}>
          <TimerContext.Provider value={counter}>
            <ButtonContext.Provider value={buttons}>
              {showCorrectPage()}
            </ButtonContext.Provider>
          </TimerContext.Provider>
        </CategoryContext.Provider>
      </LetterContext.Provider>
    </>
  )
}

export default App;