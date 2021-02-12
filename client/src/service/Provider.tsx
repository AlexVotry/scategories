import React, { useState } from 'react';
import socket from './socketConnection';

import WebSocketUtiltiy from './WebSocketUtility';
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

function Provider() {
  const [user, setUser] = useState({});
  const [userAnswers, setUserAnswers] = useState(new Map());

  const update = user => setUser(user);
  const updateUA = answers => setUserAnswers(answers);

  // socket.on('initUser', info => {
  //   user.update(info.currentUser);
  //   setMyTeam(user.team);
  //   setTeams(info.teams)
  // });
  
  socket.on('currentUser', newUser => {
    console.log('newUser', newUser);
      setUser(newUser);
  })


    return (
      <UserContext.Provider value={{ user, update }}>
        <TeamsContext.TeamsProvider >
          <CategoryContext.CategoryProvider>
            <LetterContext.LetterProvider>
              <GameStateContext.GameStateProvider>
                <FinalAnswersContext.FinalAnswersProvider>
                  <TeamScoreContext.TeamScoreProvider>
                    <TimerContext.TimerProvider>
                      <UserAnswersContext.Provider value={{ userAnswers, updateUA }}>
                        <WebSocketUtiltiy/>
                      </UserAnswersContext.Provider>
                    </TimerContext.TimerProvider>
                  </TeamScoreContext.TeamScoreProvider>
                </FinalAnswersContext.FinalAnswersProvider>
              </GameStateContext.GameStateProvider>
            </LetterContext.LetterProvider>
          </CategoryContext.CategoryProvider>
        </TeamsContext.TeamsProvider>
      </UserContext.Provider>
    )
}

export default Provider;