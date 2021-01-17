import React, {useState, useContext, useEffect } from 'react';
import socket from './socketConnection';
// import io from 'socket.io-client';
import { find, remove, isEqual, isEmpty, set } from 'lodash';
import { assignTeam } from '../service/parseTeams';

import App from '../components/App/App';
import UserContext from '../contexts/UserContext';
import TeamsContext from '../contexts/TeamsContext';
import LetterContext from '../contexts/LetterContext';
import CategoryContext from '../contexts/CategoryContext';
import TimerContext from '../contexts/TimerContext';
import GameStateContext from '../contexts/GameStateContext';
import OtherAnswersContext from '../contexts/OtherAnswersContext';

function WebSocketUtility () {
  // const localState = JSON.parse(localStorage.getItem("userInfo"));
  const localState = {};
  const [teams, setTeams] = useState([]);
  const [myTeam, setMyTeam] = useState('');
  const [user, setUser] = useState(localState);
  const [gameState, setGameState] = useState('ready');
  const [timer, setTimer] = useState(60);
  const [currentLetter, setCurrentLetter] = useState('');
  const [categories, setCategories] = useState([]);
  // const [otherAnswers, setOtherAnswers] = useState({})
  const [otherAnswers, setOtherAnswers] = useState(new Map())

  const update = user => setUser(user);
  const updateOA = answers => setOtherAnswers(answers);
  // const divvyTeams = teams => this.setState({ teams });

  useEffect(() => {
    initialize();
    updateUser();
    // updateTeams();
  }, [user, teams, gameState]);

  const updateUser = () => {
    socket.on('currentUser', user => setUser(user));
  }

  // const updateTeams = () => {
  //   socket.on('currentUser', user => setUser(user));
  // }

  const initialize = () => {
    socket.on('newGame', gameInfo => {
      setCategories(gameInfo.categories);
      setCurrentLetter(gameInfo.currentLetter);
    });

    socket.on('newTeams', newTeams => {
      setTeams(newTeams);
      const team = !isEmpty(user) ? assignTeam(newTeams, user) : null;
      const newUser = {...user, team };
      setUser(newUser);
      setMyTeam(team);
    }).emit('myTeam', user.team);

    socket.on('gameState', gameState => {
      setGameState(gameState)
    });

    socket.on('Clock', clock => {
      setTimer(clock);
    });

    socket.on('AllSubmissions', otherAnswers => {
      setGameState('ready');
      // setOtherAnswers(otherAnswers);
      // console.log('otherAnswers', otherAnswers)
    });

    // socket.on('updateAnswers', newGuesses => {
    //   const { answers, name } = newGuesses;
    //   console.log('newGuess:', answers)
    //   setOtherAnswers(answers);
    //   // if (name === props.name) setGuesses(answers);
    // })
  }

  return (
    <UserContext.Provider value={{ user, update }}>
      <TeamsContext.Provider value={teams}>
        <CategoryContext.Provider value={categories}>
          <LetterContext.Provider value={currentLetter}>
            <TimerContext.Provider value={timer}>
              <GameStateContext.Provider value={gameState}>
              <OtherAnswersContext.Provider value={{otherAnswers, updateOA}}>
                <App myTeam={myTeam}/>
              </OtherAnswersContext.Provider>
              </GameStateContext.Provider>
            </TimerContext.Provider>
          </LetterContext.Provider>
        </CategoryContext.Provider>
      </TeamsContext.Provider>
    </UserContext.Provider>
  )

}

export default WebSocketUtility;