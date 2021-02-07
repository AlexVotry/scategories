import React, { useState, useContext, useEffect } from 'react';
import socket from './socketConnection';
import { find, remove, isEqual, isEmpty, set } from 'lodash';
import { assignTeam } from '../service/parseTeams';

import App from '../components/App/App';
import UserContext from '../contexts/UserContext';
import TeamsContext from '../contexts/TeamsContext';
import LetterContext from '../contexts/LetterContext';
import CategoryContext from '../contexts/CategoryContext';
import { resetAnswersAndScores } from '../service/reset';
import GameStateContext from '../contexts/GameStateContext';
import UserAnswersContext from '../contexts/UserAnswersContext';
import FinalAnswersContext from '../contexts/FinalAnswersContext';
import TeamScoreContext from '../contexts/TeamScoreContext';

function WebSocketUtility() {
  
  const [teams, setTeams] = useState({});
  const [prevTeams, setprevTeams] = useState('');
  const [myTeam, setMyTeam] = useState('');
  const [user, setUser] = useState({});
  const [userPrev, setUserPrev] = useState({});
  const [gameState, setGameState] = useState('ready');
  const [prevGameState, setprevGameState] = useState('');
  // const [timer, setTimer] = useState(0);
  const [currentLetter, setCurrentLetter] = useState('');
  const [categories, setCategories] = useState([]);
  const [finalAnswers, setFinalAnswers] = useState({});
  const [prevFinalAnswers, setPrevFinalAnswers] = useState({ empty: 0 });
  const [userAnswers, setUserAnswers] = useState(new Map());

  const update = user => setUser(user);
  const updateUA = answers => setUserAnswers(answers);

  socket.on('initUser', info => {
    setUser(info.currentUser);
    setMyTeam(user.team);
    setTeams(info.teams)
  });

  if (!isEqual(user, userPrev)) {
    socket.on('currentUser', newUser => {
      // console.log('NewUser', newUser, user);
      if (!isEmpty(newUser)) {
        setUser(newUser);
        setUserPrev(newUser);
      }
    })
  }

  socket.on('newGame', gameInfo => {
    setCategories(gameInfo.categories);
    setCurrentLetter(gameInfo.currentLetter);
  });

  if (!isEqual(prevTeams, teams)) {
    setprevTeams(teams);
    socket.on('newTeams', newTeams => {
      setTeams(newTeams);
      const localState = JSON.parse(localStorage.getItem("userInfo"));
      const team = !isEmpty(localState) ? assignTeam(newTeams, localState) : null;
      const newUser = { ...localState, team };
      setUser(newUser);
      console.log('newUser:', newUser);
      setMyTeam(team);
      localStorage.removeItem('userInfo');
      localStorage.setItem('userInfo', JSON.stringify(newUser));
    }).emit('myTeam', user.team);
  }

  if (!isEqual(prevGameState, gameState)) {
    setprevGameState(gameState);
    socket.on('gameState', gameState => {
      setGameState(gameState);
    });
  }

  socket.on('AllSubmissions', finalSubmissions => {
  const teamArray = Object.keys(finalSubmissions);
      setGameState('ready');

      teamArray.forEach(team => {
        const teamAnswers = finalSubmissions[team].answers;

        if (typeof teamAnswers === 'string') {
          finalSubmissions[team].answers = new Map(JSON.parse(finalSubmissions[team].answers));
        }
      })
      setFinalAnswers(finalSubmissions);
    });

  if (!isEqual(prevFinalAnswers, finalAnswers)) {
    socket.on('startOver', numOfCategories => {
      const answerMap = resetAnswersAndScores(numOfCategories);
      const teamArray = Object.keys(teams);
      let finalSubs = {};
      teamArray.forEach(team => {
        finalSubs = { ...finalSubs, [team]: { answers: answerMap, score: 0 } }
      });
      setFinalAnswers(finalSubs);
      setGameState('ready');
    })
  }

  return (
    <UserContext.Provider value={{ user, update }}>
      <TeamsContext.Provider value={teams}>
        <CategoryContext.Provider value={categories}>
          <LetterContext.Provider value={currentLetter}>
            <GameStateContext.Provider value={gameState}>
              <FinalAnswersContext.Provider value={finalAnswers}>
                <TeamScoreContext.TeamScoreProvider>
                  <UserAnswersContext.Provider value={{ userAnswers, updateUA }}>
                    <App myTeam={myTeam} />
                  </UserAnswersContext.Provider>
                </TeamScoreContext.TeamScoreProvider>
              </FinalAnswersContext.Provider>
            </GameStateContext.Provider>
          </LetterContext.Provider>
        </CategoryContext.Provider>
      </TeamsContext.Provider>
    </UserContext.Provider>
  )

}

export default WebSocketUtility;