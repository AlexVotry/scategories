// displays the list of teams and the players on each team.

import React, { useContext } from 'react';
import TeamsContext from '../contexts/TeamsContext';

function TeamList () {
  const list = useContext(TeamsContext);
  
console.log('context', list);

  const renderTeams = () => {
    return Object.keys(list).map(team => {
      const members = list[team];
      if (members.length) {
        return (
          <div key={team}>
            <h4>{team}</h4>
            <ol>
              {parseTeamMembers(members)}
            </ol>
          </div>
        )
      }
    })
  }

  const parseTeamMembers = (members) => {
    return members.map(member => {
      return (
        <li key={member.name}>{member.name}</li>
      )
    })
  }

  return (
    <div>
      <h3>Teams</h3>
      {renderTeams()}
    </div>
  );
};

export default TeamList;