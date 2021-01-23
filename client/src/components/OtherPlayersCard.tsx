// shows the scategory list (PlayerList component), letter, timer, and control buttons for each team. 

import React, { useContext, useState } from 'react';
import OthersGameSheet from './OthersGameSheet';
import Timer from './Timer';
import Letter from './Letter';
import ControlButtons from './ControlButtons';
import UserContext from '../contexts/UserContext';
import TeamsContext from '../contexts/TeamsContext';
import { styles, colors } from '../cssObjects';
import { findOthers } from '../service/parseTeams';

const OtherPlayersCard = () => {
  const [teammates, setTeammates] = useState([]);
  const { user } = useContext(UserContext);
  const teams = useContext(TeamsContext);
  const team = teams[user.team];
  const others = findOthers(team, user);
  const cardWidth = `${others.length * 20}%`
  const cardStyle = {
    ...styles.flexRow,
    backgroundColor: colors[user.team],
    color: colors.White,
    width: cardWidth,
    height: '70vh',
    padding: '10px'
  }
  const listStyle = {
    alignItems: 'flex-start',
    padding: '5%',
    width: '38%',
    border: '4px ridge white'
  }

  const renderOthers = () => {
    return others.map(({name}) => {
      return (
        <div key={name} style={listStyle}>
          <div style={{textAlign: 'center'}}>{name}</div>
          <OthersGameSheet name={name}/>
        </div>
      )
    })
  }

  return (
        <div style={cardStyle} >
          {renderOthers()}
        </div>
  )
}

export default OtherPlayersCard;