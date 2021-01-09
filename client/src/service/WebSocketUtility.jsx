import React, {useState, useContext, useEffect } from 'react';
import socket from './socketConnection';
// import io from 'socket.io-client';
import { find, remove, isEqual, isEmpty } from 'lodash';
import { assignTeam } from '../service/parseTeams';

import App from '../components/App/App';
import {UserContext} from '../contexts/UserContext';
import TeamsContext from '../contexts/TeamsContext';


function WebSocketUtility () {
  const [teams, setTeams] = useState([]);
  const [user, setUser] = useState({})

  // update = user => this.setState({ user });
  // const divvyTeams = teams => this.setState({ teams });

  useEffect(() => {
    initialize();
    updateUser();
  }, [user, teams]);

  // componenWillMount() {
  //   this.setState({ prevuser: this.state.user });
  //   this.initialize();
  // }; 

  // componentDidUpdate() {
  //   console.log('update')
  //   this.initialize();
  //   const sameuser = isEqual(this.state.prevuser, this.state.user);
  //   if (!sameuser) {
  //     this.updateUser();
  //   }
  // }

  const updateUser = () => {
    socket.on('currentUser', user => setUser(user));
  }

  const initialize = () => {
    socket.on('newTeams', teams => {
      setTeams(teams);
      const team = !isEmpty(user) ? assignTeam(teams, user) : null;
      const newUser = {...user, team };
      setUser(newUser);
    }).emit('myTeam', team);
  }

  return (
    <UserContext.Provider>
      <TeamsContext.Provider value={this.state.teams}>
        <App/>
      </TeamsContext.Provider>
    </UserContext.Provider>
  )

}

export default WebSocketUtility;