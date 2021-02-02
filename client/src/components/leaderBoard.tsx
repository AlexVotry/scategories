import React from 'react';

import TeamScoreContext from '../contexts/TeamScoreContext';
import { getLeader } from '../service/parseTeams';
import { styles, colors } from '../cssObjects';

function LeaderBoard(): JSX.Element {
  const [teamScores, setTeamScores] = TeamScoreContext.useTeamScore();
  const leaderboard = getLeader(teamScores); // returns [team, score];
  // const leaderboard = [
  //   ['Blue', 27],
  //   ['Red', 22],
  //   ['Green', 20],
  //   ['Gold', 18],
  //   ['Purple', 10]
  // ]

  const displayLeaderBoard = () => {
    if (!leaderboard.length) return <div></div>;

    return leaderboard.map(team => {
      return <div key={team[0]} style={{color: colors[team[0]]}}>{team[0]} : {team[1]}</div>
    })
  }

  return (
    <div id="leaderboard" className="leaderBoard" style={ styles.flexColumn }>
      {displayLeaderBoard()}
    </div>
  );
}

export default LeaderBoard;
