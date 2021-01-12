import React from 'react';

import OpeningPage from '../OpeningPage';
import CurrentPlayerCard from '../CurrentPlayerCard';
import OtherPlayersCard from '../OtherPlayersCard';

import { styles } from '../../cssObjects';

function App({gameState}): JSX.Element {

  const showCorrectPage = () => {
    if (gameState === 'running') {
      return (
        <div style={styles.flexRow}>
          <CurrentPlayerCard />
          <OtherPlayersCard />
        </div>
      );
    }

    return <OpeningPage />;
  }

return showCorrectPage();
}

export default App;