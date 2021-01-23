import React, {useContext, useState} from 'react';

import OpeningPage from '../OpeningPage';
import CurrentPlayerCard from '../CurrentPlayerCard';
import OtherPlayersCard from '../OtherPlayersCard';
import UserAnswersContext from '../../contexts/UserAnswersContext';
import GameStateContext from '../../contexts/GameStateContext';

import socket from '../../service/socketConnection';
import { styles } from '../../cssObjects';

function App({ myTeam}): JSX.Element {
const gameState = useContext(GameStateContext);
const {userAnswers} = useContext(UserAnswersContext);

  const showCorrectPage = () => {
    if (gameState === 'running') {
      return (
        <div style={styles.flexRow}>
            <CurrentPlayerCard />
            <OtherPlayersCard />
        </div>
      );
    } 
    if (gameState === 'ready' && userAnswers.size) {
      const final = JSON.stringify(Array.from(userAnswers.entries()));
      socket.emit('FinalAnswer', { team: myTeam, answers: final });
      userAnswers.clear();
    }

    return <OpeningPage />;
  }

return showCorrectPage();

}

export default App;