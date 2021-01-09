import React, {useState} from 'react';
import socket from './socketConnection';
// import io from 'socket.io-client';
import { find, remove, isEqual, isEmpty } from 'lodash';
import { assignTeam } from '../service/parseTeams';

import App from '../components/App/App';
import { UserProvider } from '../contexts/UserContext';
import TeamsContext from '../contexts/TeamsContext';


class WebSocketUtility extends React.Component {
  state = { teams: {}, status: {}, prevStatus: {}, user: {}, prevuser: {}, recievedUpdate: {}, prevRecievedUpdate: {} };

  update = user => this.setState({ user });
  divvyTeams = teams => this.setState({ teams });

  componenWillMount() {
    this.setState({ prevuser: this.state.user });
    this.initialize();
  }; 

  componentDidUpdate() {
    console.log('update')
    this.initialize();
    const sameuser = isEqual(this.state.prevuser, this.state.user);
    if (!sameuser) {
      this.updateUser();
    }
  }

  updateUser = () => {
    this.setState({ prevuser: this.state.user });
    socket.on('currentUser', user => this.setState({user}));
  }

  initialize = () => {
    socket.on('newTeams', teams => {
      this.setState({ teams });
      const team = !isEmpty(this.state.user) ? assignTeam(teams, this.state.user) : null;
      const newUser = {...this.state.user, team };
      this.setState({ user: newUser });

    }).emit('myTeam', team);
  }


  render () {
    return (
      <UserProvider value={{ user: this.state.user, update: this.update }}>
        <TeamsContext.Provider value={this.state.teams}>
          <App/>
        </TeamsContext.Provider>
      </UserProvider>
    )
  }
}

export default WebSocketUtility;