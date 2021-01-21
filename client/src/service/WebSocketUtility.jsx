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
import OtherAnswersContext from '../contexts/OtherAnswersContext';
import FinalAnswersContext from '../contexts/FinalAnswersContext';
// import TeamScoreContext from '../contexts/TeamScoreContext';

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
  const [finalAnswers, setFinalAnswers] = useState({})
  const [otherAnswers, setOtherAnswers] = useState(new Map())
  const [finalSubmited, setFinalSubmited] = useState(false);
  const [teamScore, setTeamScore] = useState({});

  const update = user => setUser(user);
  const updateOA = answers => setOtherAnswers(answers);
  const updateScore = teamScore => setTeamScore(teamScore);
  // const divvyTeams = teams => this.setState({ teams });

  useEffect(() => {
    initialize();
  }, [user, teams]);

  const initialize = () => {
    socket.on('currentUser', user => setUser(user));

    socket.on('newGame', gameInfo => {
      setCategories(gameInfo.categories);
      setCurrentLetter(gameInfo.currentLetter);
    });

    socket.on('newTeams', newTeams => {
      setTeams(newTeams);
      console.log('newTeams:', teams);
      const team = !isEmpty(user) ? assignTeam(newTeams, user) : null;
      const newUser = {...user, team };
      setUser(newUser);
      setMyTeam(team);
    }).emit('myTeam', user.team);

    socket.on('gameState', gameState => {
      setGameState(gameState)
      console.log('gamesstate:', gameState);
      if (gameState === 'running');
    });

    socket.on('Clock', clock => {
      setTimer(clock);
    });
    if (!finalSubmited) {
      setFinalSubmited(true);
      socket.on('AllSubmissions', finalSubmissions => {
        console.log('sub:', timer, finalSubmited)
        const teamArray = Object.keys(finalSubmissions);
        setGameState('ready');
        
        teamArray.forEach(team => {
          const teamAnswers = finalSubmissions[team].answers;
          
          if (typeof teamAnswers === 'string') {
            finalSubmissions[team].answers = new Map(JSON.parse(finalSubmissions[team].answers));
          }
        })
        setFinalAnswers(finalSubmissions);
        console.log('finalSubmissions', finalSubmissions)
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
                {/* <TeamScoreContext.Provider value = {{ teamScore, updateScore }}> */}
                <OtherAnswersContext.Provider value={{ otherAnswers, updateOA }}>
                  <App myTeam={myTeam}/>
                </OtherAnswersContext.Provider>
                {/* </TeamScoreContext.Provider> */}
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