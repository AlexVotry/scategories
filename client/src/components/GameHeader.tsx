import React, {useContext} from 'react';
import { styles } from '../cssObjects';
import UserContext from '../contexts/UserContext';
import Letter from './Letter/Letter';
import Timer from './Timer';

function GameHeader(): JSX.Element {
const {user} = useContext(UserContext);

  return (
    <>
      <div id="letterHeader" style={styles.flexHeader}>
        <Letter />
        <Timer />
      </div>
    </>
  )
}

export default GameHeader;