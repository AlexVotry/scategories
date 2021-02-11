import React, { useState, useContext, useEffect, useMemo } from 'react';
import socket from './socketConnection';
import { find, remove, isEqual, isEmpty, set } from 'lodash';
import { assignTeam } from '../service/parseTeams';

import App from '../components/App/App';
import UserContext from '../contexts/UserContext';
import TeamsContext from '../contexts/TeamsContext';
import LetterContext from '../contexts/LetterContext';
import CategoryContext from '../contexts/CategoryContext';
import GameStateContext from '../contexts/GameStateContext';
import UserAnswersContext from '../contexts/UserAnswersContext';
import FinalAnswersContext from '../contexts/FinalAnswersContext';
import TeamScoreContext from '../contexts/TeamScoreContext';
import TimerContext from '../contexts/TimerContext';

function WebSocketUtility() { 
  const [teams, setTeams] = useState({});
  const [prevTeams, setprevTeams] = useState('');
  const [myTeam, setMyTeam] = useState('');
  const [user, setUser] = useState({});
  const [userPrev, setUserPrev] = useState({});
  const [gameState, setGameState] = useState('ready');
  const [prevGameState, setprevGameState] = useState('');
  const [currentLetter, setCurrentLetter] = useState('');
  const [categories, setCategories] = useState([]);
  const [userAnswers, setUserAnswers] = useState(new Map());
  const [timer, setTimer] = useState(60);
  const [messages, setMessages] = useState([]);

  const update = user => setUser(user);
  const updateUA = answers => setUserAnswers(answers);

  useEffect(() => {
    console.log('useEffect user:', user)
    // if (!isEqual(user, userPrev)) setUserPrev(user);
    // if (!isEqual(teams, prevTeams)) setprevTeams(teams);
    // if (prevGameState !== gameState) setprevGameState(gameState);
  }, [user, gameState, teams])

  socket.on('initUser', info => {
    setUser(info.currentUser);
    setMyTeam(user.team);
    setTeams(info.teams)
  });

  socket.on('currentUser', newUser => {
    if (!isEmpty(newUser)) {
      setUser(newUser);
    }
  })

  socket.on('newGame', gameInfo => {
    if (currentLetter != gameInfo.currentLetter) {
      setCategories(gameInfo.categories);
      setCurrentLetter(gameInfo.currentLetter);
    }
  });

  if (isEmpty(teams)) {
    socket.on('newTeams', newTeams => {
        setTeams(newTeams);
        // const localState = JSON.parse(localStorage.getItem("userInfo"));
        const localState = user;
        const team = !isEmpty(localState) ? assignTeam(newTeams, localState) : null;
        const newUser = { ...localState, team };
        setUser(newUser);
        setMyTeam(team);
        localStorage.removeItem('userInfo');
        localStorage.setItem('userInfo', JSON.stringify(newUser));
        socket.emit('myTeam', team);
      })
    }

  socket.on('gameState', gameState => {
    if (prevGameState !== gameState) {
      setGameState(gameState);
    }
  });

  socket.on('updateMessage', newMessages => {
    console.log('newMessages:', newMessages, messages);
    if (messages.slice(-1) !== newMessages) {
      setMessages(arr => [...arr, newMessages]);
    }
  });

  // socket.on('Clock', clock => setTimer(clock));

  return useMemo(() => {
    return (
      <UserContext.Provider value={{ user, update }}>
        <TeamsContext.Provider value={teams}>
          <CategoryContext.Provider value={categories}>
            <LetterContext.Provider value={currentLetter}>
              <GameStateContext.Provider value={gameState}>
                <FinalAnswersContext.FinalAnswersProvider>
                  <TeamScoreContext.TeamScoreProvider>
                    <TimerContext.Provider value={timer}>
                    <UserAnswersContext.Provider value={{ userAnswers, updateUA }}>
                      <App myTeam={myTeam} messages={messages} />
                    </UserAnswersContext.Provider>
                    </TimerContext.Provider>
                  </TeamScoreContext.TeamScoreProvider>
                </FinalAnswersContext.FinalAnswersProvider>
              </GameStateContext.Provider>
            </LetterContext.Provider>
          </CategoryContext.Provider>
        </TeamsContext.Provider>
      </UserContext.Provider>
    )
  }, [user, teams, categories, currentLetter, gameState, myTeam, timer, messages]);
}

export default WebSocketUtility;