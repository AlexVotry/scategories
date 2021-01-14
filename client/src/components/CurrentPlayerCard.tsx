// shows the scategory list (GameSheet component), letter, timer, and control buttons for each team. 

import React, { useContext } from 'react';
import GameSheet from './GameSheet';
import Timer from './Timer';
import Letter from './Letter';
import ControlButtons from './ControlButtons';
import UserContext from '../contexts/UserContext';
import TeamsContext from '../contexts/TeamsContext';
import { styles, colors } from '../cssObjects';

const CurrentPlayerCard = () => {
  const {user} = useContext(UserContext);
  const teams = useContext(TeamsContext);
  const cardStyle = {
    backgroundColor: colors[user.team],
    color: colors.White
  }
  const team = teams[user.team];

  return (
        <div  style={cardStyle} >
          <div className="cardContent" >
            <div style={styles.flexRow}>
              <div>TEAM {user.team}</div>
              player: {user.name}
              <Letter />
              <Timer />
            </div>
            <GameSheet />
            <ControlButtons />
          </div>
        </div>
  )
}

export default CurrentPlayerCard;