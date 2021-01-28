import React from 'react';

import TeamScoreContext from '../contexts/TeamScoreContext';
import { getLeader } from '../service/parseTeams';
import { styles, colors } from '../cssObjects';

function LeaderBoard(): JSX.Element {
  const [teamScores, setTeamScores] = TeamScoreContext.useTeamScore();
  const leaderboard = getLeader(teamScores); // returns [team, score];

  const displayLeaderBoard = () => {
    if (!leaderboard.length) return <div></div>;

    return leaderboard.map(team => {
      return <div key={team[0]} style={{color: colors[team[0]]}}>{team[0]} : {team[1]}</div>
    })
  }

  return (
    <div className="leaderBoard" style={ styles.flexColumn }>
      {displayLeaderBoard()}
    </div>
  );
}

export default LeaderBoard;
