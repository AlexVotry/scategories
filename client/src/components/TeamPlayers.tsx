// shows the scategory list (PlayerList component), letter, timer, and control buttons for each team. 

import React, { useContext } from 'react';
import PlayerList from './PlayerList';
import Timer from './Timer';
import Letter from './Letter';
import ControlButtons from './ControlButtons';
import UserContext from '../contexts/UserContext';
import { styles } from '../cssObjects';

const TeamPlayers = () => {
  const {user} = useContext(UserContext);

  return (
    <div className="row">
      <div className="col s12 m12">
        <div className="card blue-grey darken-1">
          <div className="card-content white-text" >
            <div style={styles.flexRow}>
              <div>TEAM {user.team}</div>
              player: {user.name}
              <Letter />
              <Timer />
            </div>
             
            <PlayerList />
            <ControlButtons />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamPlayers;