import React, {useContext} from 'react';

import Letter from './Letter/Letter';
import Timer from './Timer';
import { styles } from '../cssObjects';
import LeaderBoard from './leaderBoard';

function GameHeader(): JSX.Element {

  return (
    <>
      <div id="letterHeader" style={styles.flexHeader}>
        <LeaderBoard/>
        <Letter />
        <Timer />
      </div>
    </>
  )
}

export default GameHeader;