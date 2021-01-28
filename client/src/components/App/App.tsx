import React, {useContext, useState} from 'react';

import OpeningPage from '../OpeningPage';
import CurrentPlayerCard from '../CurrentPlayerCard';
import OtherPlayersCard from '../OtherPlayersCard';
import GameHeader from '../GameHeader';
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
        <div className="app" style={styles.flexColumn}>
          <GameHeader />
          <div className="appDisplayCards" style={styles.flexPlayers}>
              <CurrentPlayerCard />
              <OtherPlayersCard />
          </div>
        </div>
      );
    } 
    if (gameState === 'ready' && userAnswers.size) {
      // const results = new Map();
      // // remove the name from the key so they match all other players key for comparison.
      // userAnswers.forEach((value, key) => {
      //   const index = parseInt(key.substring(0, 2));
      //   results.set(index, value);
      // })
      const final = JSON.stringify(Array.from(userAnswers.entries()));
      socket.emit('FinalAnswer', { team: myTeam, answers: final });
      userAnswers.clear();
    }

    return <OpeningPage />;
  }

return showCorrectPage();

}

export default App;