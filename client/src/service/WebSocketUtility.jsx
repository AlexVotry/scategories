import React, {useState, useContext, useEffect } from 'react';
import socket from './socketConnection';
// import io from 'socket.io-client';
import { find, remove, isEqual, isEmpty } from 'lodash';
import { assignTeam } from '../service/parseTeams';

import App from '../components/App/App';
import UserContext from '../contexts/UserContext';
import TeamsContext from '../contexts/TeamsContext';

function WebSocketUtility () {
  // const localState = JSON.parse(localStorage.getItem("userInfo"));
  const localState = {};
  const [teams, setTeams] = useState([]);
  const [user, setUser] = useState(localState);
  const [gameState, setGameState] = useState('ready');

  const update = user => setUser(user);
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
    socket.on('newTeams', newTeams => {
      setTeams(newTeams);
      const team = !isEmpty(user) ? assignTeam(newTeams, user) : null;
      const newUser = {...user, team };
      setUser(newUser);
    }).emit('myTeam', user.team);

    socket.on('gameState', (gameState) => {
      setGameState(gameState)
      console.log('gamestate:', gameState)
    });

  }

  return (
    <UserContext.Provider value={{ user, update }}>
      <TeamsContext.Provider value={teams}>
        <App gameState={gameState} />
      </TeamsContext.Provider>
    </UserContext.Provider>
  )

}

export default WebSocketUtility;