import React, {useContext, useEffect, useMemo} from 'react';

import OpeningPage from '../OpeningPage';
import CurrentPlayerCard from '../CurrentPlayerCard';
import OtherPlayersCard from '../OtherPlayersCard';
import ControlButtons from '../ControlButtons';
import GameHeader from '../GameHeader';

import UserAnswersContext from '../../contexts/UserAnswersContext';
import GameStateContext from '../../contexts/GameStateContext';

import socket from '../../service/socketConnection';
import { styles } from '../../cssObjects';
import { stringify } from '../../service/strings';

function App({ myTeam, messages }): JSX.Element {
  const gameState = useContext(GameStateContext);
  const {userAnswers} = useContext(UserAnswersContext);

    // send answers to server
  if (gameState === 'ready' && userAnswers.size) {
    const final = stringify(userAnswers);
    socket.emit('FinalAnswer', { team: myTeam, answers: final });
    userAnswers.clear();
  }

  const showCorrectPage = () => {
    console.log('app', messages)
    if (gameState === 'running') {
      return (
        <div className="app" style={styles.flexColumn}>
          <GameHeader />
          <div className="appDisplayCards" style={styles.flexPlayers}>
              <CurrentPlayerCard />
              <OtherPlayersCard messages = {messages}/>
          </div>
          <div>
            <ControlButtons />
          </div>
        </div>
      );
    } 

    return <OpeningPage/>;
  }
  return useMemo(() => {
    return showCorrectPage();
  }, [gameState, myTeam, messages])
}

export default App;