// first page to be seen, 

import React, { useContext } from 'react';

import Letter from './Letter';
import CategoryList from './CategoryList';
import Timer from './Timer';
import ControlButtons from './ControlButtons';
import Settings from './Settings';
import JoinTeam from './JoinTeam';
import TeamList from './TeamList';
import UserContext from '../contexts/UserContext';
import { isEmpty } from 'lodash';

const OpeningPage = () => {
  const {user} = useContext(UserContext);

  const joinTeam = () => {
    if (!isEmpty(user)) return null;
    return <JoinTeam/>
  }
  const displayName = () => {
    if (isEmpty(user)) return null;
    const name = user.name ? `Player: ${user.name}` : '';
    const team = user.team ? `Team: ${user.team}` : '';
    console.log('display user:', user.name, name);
      return (
        <>
        <h5>{name}</h5>
        <h5>{team}</h5>
        </>
      )
  }
  
  return (
    <div className ="row">
        <Letter/>
        <CategoryList />
        <div className ="col s4">
          {displayName()}
          <Timer/>
          <ControlButtons/>
          <TeamList/>
          {joinTeam()}
          {/* <Settings /> */}
        </div>
    </div>
  );
};

export default OpeningPage;