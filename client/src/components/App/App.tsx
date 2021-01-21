import React, {useContext, useState} from 'react';

import OpeningPage from '../OpeningPage';
import CurrentPlayerCard from '../CurrentPlayerCard';
import OtherPlayersCard from '../OtherPlayersCard';
import OtherAnswersContext from '../../contexts/OtherAnswersContext';
// import OtherAnswersContext from '../../contexts/OtherAnswersContext';
import GameStateContext from '../../contexts/GameStateContext';
import TimerContext from '../../contexts/TimerContext';

import socket from '../../service/socketConnection';
import { styles } from '../../cssObjects';

function App({ myTeam}): JSX.Element {
const gameState = useContext(GameStateContext);
const {otherAnswers} = useContext(OtherAnswersContext);

  const showCorrectPage = () => {
    if (gameState === 'running') {
      return (
        <div style={styles.flexRow}>
            <CurrentPlayerCard />
            <OtherPlayersCard />
        </div>
      );
    } 
    if (gameState === 'ready' && otherAnswers.size) {
      console.log('app gameste:', gameState);
      const final = JSON.stringify(Array.from(otherAnswers.entries()));
      socket.emit('FinalAnswer', { team: myTeam, answers: final });
      otherAnswers.clear();
    }

    return <OpeningPage />;
  }

return (
  <>
        {showCorrectPage()}
  </>
)
}

export default App;