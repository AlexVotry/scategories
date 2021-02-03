import React, {useState, useContext, useEffect } from 'react';
import socket from './socketConnection';
import { find, remove, isEqual, isEmpty, set } from 'lodash';
import { assignTeam } from '../service/parseTeams';

import App from '../components/App/App';
import UserContext from '../contexts/UserContext';
import TeamsContext from '../contexts/TeamsContext';
import LetterContext from '../contexts/LetterContext';
import CategoryContext from '../contexts/CategoryContext';
import TimerContext from '../contexts/TimerContext';
import GameStateContext from '../contexts/GameStateContext';
import UserAnswersContext from '../contexts/UserAnswersContext';
import FinalAnswersContext from '../contexts/FinalAnswersContext';
import TeamScoreContext from '../contexts/TeamScoreContext';

function WebSocketUtility () {
  const localState = {};
  const [teams, setTeams] = useState({});
  const [myTeam, setMyTeam] = useState('');
  const [user, setUser] = useState(localState);
  const [gameState, setGameState] = useState('ready');
  const [timer, setTimer] = useState(6);
  const [currentLetter, setCurrentLetter] = useState('');
  const [categories, setCategories] = useState([]);
  const [finalAnswers, setFinalAnswers] = useState({})
  const [userAnswers, setUserAnswers] = useState(new Map())
  const [finalSubmited, setFinalSubmited] = useState(false);
  const [teamScores, setTeamScore] = useState([]);

  const update = user => setUser(user);
  const updateUA = answers => setUserAnswers(answers);
  // const updateScore = teamScore => setTeamScore(teamScore);
  // const divvyTeams = teams => this.setState({ teams });

  useEffect(() => {
    initialize();
  }, [user, teams]);
  
  const initialize = () => {
    
    socket.on('initUser', info => {
      setUser(info.currentUser);
      setMyTeam(user.team);
      setTeams(info.teams)
    });

    socket.on('currentUser', user => setUser(user));

    socket.on('newGame', gameInfo => {
      setCategories(gameInfo.categories);
      setCurrentLetter(gameInfo.currentLetter);
    });

    socket.on('newTeams', newTeams => {
      setTeams(newTeams);
      const team = !isEmpty(user) ? assignTeam(newTeams, user) : null;
      const newUser = {...user, team };
      localStorage.removeItem('userInfo');
      setUser(newUser);
      setMyTeam(team);
      localStorage.setItem('userInfo', JSON.stringify(newUser));
    }).emit('myTeam', user.team);

    socket.on('gameState', gameState => {
      setGameState(gameState)
      // if (gameState === 'running');
    });

    socket.on('Clock', clock => {
      setTimer(clock);
    });
    if (!finalSubmited) {
      setFinalSubmited(true);
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
    }

  }

  return (
    <UserContext.Provider value={{ user, update }}>
      <TeamsContext.Provider value={teams}>
        <CategoryContext.Provider value={categories}>
          <LetterContext.Provider value={currentLetter}>
            <TimerContext.Provider value={timer}>
              <GameStateContext.Provider value={gameState}>
              <FinalAnswersContext.Provider value={finalAnswers}>
                <TeamScoreContext.TeamScoreProvider>
                <UserAnswersContext.Provider value = {{ userAnswers, updateUA }}>
                  <App myTeam={myTeam}/>
                </UserAnswersContext.Provider>
                </TeamScoreContext.TeamScoreProvider>
              </FinalAnswersContext.Provider>
              </GameStateContext.Provider>
            </TimerContext.Provider>
          </LetterContext.Provider>
        </CategoryContext.Provider>
      </TeamsContext.Provider>
    </UserContext.Provider>
  )

}

export default WebSocketUtility;