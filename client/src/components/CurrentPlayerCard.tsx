// shows the scategory list (GameSheet component), letter, timer, and control buttons for each team. 

import React, { useContext } from 'react';
import GameSheet from './GameSheet';
import Timer from './Timer';
import Letter from './Letter/Letter';
import ControlButtons from './ControlButtons';
import UserContext from '../contexts/UserContext';
import TeamsContext from '../contexts/TeamsContext';
import { styles, colors } from '../cssObjects';

const CurrentPlayerCard = () => {
  const {user} = useContext(UserContext);
  const teams = useContext(TeamsContext);
  const cardStyle = {
    backgroundColor: colors[user.team],
    color: colors.White,
    marginRight: '10px',
    padding: '10px'
  }
  const team = teams[user.team];

  return (
    <div className="currentPlayerCard" style={styles.flexColumn}>
      <div className="gameCard" style={cardStyle} >
        <GameSheet />
      </div>
      <ControlButtons />
    </div>
  )
}

export default CurrentPlayerCard;