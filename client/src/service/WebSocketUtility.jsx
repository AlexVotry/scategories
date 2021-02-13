import React, { useState, useContext, useEffect, useMemo } from 'react';
import socket from './socketConnection';
import { find, remove, isEqual, isEmpty, set } from 'lodash';
import { assignTeam } from '../service/parseTeams';
import { resetAnswersAndScores } from '../service/reset';

import App from '../components/App/App';
import UserContext from '../contexts/UserContext';
import TeamsContext from '../contexts/TeamsContext';
import LetterContext from '../contexts/LetterContext';
import CategoryContext from '../contexts/CategoryContext';
import GameStateContext from '../contexts/GameStateContext';
import UserAnswersContext from '../contexts/UserAnswersContext';
import OtherGuessesContext from '../contexts/OtherGuessesContext';
import FinalAnswersContext from '../contexts/FinalAnswersContext';
import TeamScoreContext from '../contexts/TeamScoreContext';
import TimerContext from '../contexts/TimerContext';

function WebSocketUtility() { 
  const [teams, setTeams] = TeamsContext.useTeams();
  const [finalAnswers, setFinalAnswers] = FinalAnswersContext.useFinalAnswers();
  const [prevTeams, setprevTeams] = useState('');
  const [myTeam, setMyTeam] = useState('');
  const user = useContext(UserContext);
  const userInfo = user.user;
  const userAnswers = useContext(UserAnswersContext);
  const [otherGuesses, setOtherGuesses] = OtherGuessesContext.useOtherGuesses();
  const [userPrev, setUserPrev] = useState({});
  const [gameState, setGameState] =GameStateContext.useGameState();
  const [prevGameState, setprevGameState] = useState('');
  const [currentLetter, setCurrentLetter] = LetterContext.useLetter();
  const [categories, setCategories] = CategoryContext.useCategpry();
  // const [userAnswers, setUserAnswers] = useState(new Map());
  const [timer, setTimer] = TimerContext.useTimer();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // console.log('useEffect user:', userInfo)
    initiate();
    // if (!isEqual(user, userPrev)) setUserPrev(user);
    // if (!isEqual(teams, prevTeams)) setprevTeams(teams);
    // if (prevGameState !== gameState) setprevGameState(gameState);
  }, [user.user])
function initiate() {
  console.log('initiated')
  socket.on('newGame', gameInfo => {
    if (currentLetter != gameInfo.currentLetter) {
      setCategories(gameInfo.categories);
      setCurrentLetter(gameInfo.currentLetter);
    }
  });

  socket.on('newTeams', newTeams => {
      setTeams(newTeams);
      // console.log('teams:', teams, newTeams, userInfo, user.user)
      // const localState = JSON.parse(localStorage.getItem("userInfo"));
      const localState = userInfo;
      const team = !isEmpty(localState) ? assignTeam(newTeams, localState) : null;
      const newUser = { ...localState, team };
      user.update(newUser);
      setMyTeam(team);
      localStorage.removeItem('userInfo');
      localStorage.setItem('userInfo', JSON.stringify(newUser));
      socket.emit('myTeam', team);
    })

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

  socket.on('Clock', clock => setTimer(clock));

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

  socket.on('startOver', numOfCategories => {
    const answerMap = resetAnswersAndScores(numOfCategories);
    const teamArray = Object.keys(teams);
    let finalSubs = {};
    teamArray.forEach(team => {
      finalSubs = { ...finalSubs, [team]: { answers: answerMap, score: 0 } }
    });
    setFinalAnswers(finalSubs);
    setGameState('ready');
  });

  const updateUserAnswers = (i, value) => {
    const index = pad(i);
    const temp = userAnswers.userAnswers;
    if (temp.has(index)) temp.delete(index);
    temp.set(index, value);
    userAnswers.updateUA(temp);
  }

  socket.on('updateAnswers', newGuesses => {
    setOtherGuesses(newGuesses);
  })


}
  // return useMemo(() => {
    return (
      <div>
      <App myTeam={myTeam}/>
      </div>
    )
  // }, [userInfo, teams, categories, currentLetter, gameState, myTeam, timer, messages]);
}

export default WebSocketUtility;