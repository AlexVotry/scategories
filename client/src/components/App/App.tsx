import React from 'react';

import OpeningPage from '../OpeningPage';
import CurrentPlayerCard from '../CurrentPlayerCard';
import OtherPlayersCard from '../OtherPlayersCard';

import { styles } from '../../cssObjects';

function App({gameState, finalAnswers}): JSX.Element {

  const showCorrectPage = () => {
    if (gameState === 'running') {
      return (
        <div style={styles.flexRow}>
          <CurrentPlayerCard />
          <OtherPlayersCard />
        </div>
      );
    }

    return <OpeningPage finalAnswers={finalAnswers}/>;
  }

return showCorrectPage();
}

export default App;