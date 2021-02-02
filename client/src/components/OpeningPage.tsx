// first page to be seen, 

import React, { useContext } from 'react';

import Letter from './Letter/Letter';
import CategoryList from './CategoryList';
import ControlButtons from './ControlButtons';
import Settings from './Settings';
import JoinTeam from './JoinTeam';
import TeamList from './TeamList';
import UserContext from '../contexts/UserContext';
import {styles} from '../cssObjects';
import GameStateContext from '../contexts/GameStateContext';
import { isEmpty } from 'lodash';

const OpeningPage = () => {
  const {user} = useContext(UserContext);
  const openingStyle = {
    ...styles.flexRow,
    padding: '0 30px' 
  }
  // const gameState = useContext(GameStateContext);

  const joinTeam = () => {
    if (!isEmpty(user)) return null;
    return <JoinTeam/>
  }

  const displayName = () => {
    if (isEmpty(user)) return null;
    const name = user.name ? `Player: ${user.name}` : '';
    const team = user.team ? `Team: ${user.team}` : '';
      return (
        <>
        <h5>{name}</h5>
        <h5>{team}</h5>
        </>
      )
  }
  
  return (
    <>
    <div className="adminBtns" style={styles.flexRow}>
      <ControlButtons/>
      <Settings />
    </div>
    <div className="OpeningPage" style={openingStyle}>
      <div className="openingPageLeft" style={{width: '70vw'}}>
        <CategoryList/>
        {joinTeam()}
      </div>
      <div className="teamList" style={{ width: '25vw' }}>
        <TeamList/>
      </div>
    </div>
    </>
  );
};

export default OpeningPage;