//group of buttons.

import React, {useContext} from 'react';
import ButtonContext from '../contexts/ButtonContext';

type ControlButtonProps = {
  startGame: Function;
  stopGame: Function;
  resetEverything: Function;
}

const ControlButtons = () => {
  const buttons = useContext(ButtonContext);

  const start = () => {
    buttons.startGame();
  }
  const stop = () => {
    buttons.stopGame();
  }
  const reset = () => {
    buttons.resetEverything();
  }

  const createTeams = () => {
    buttons.createTeams();
  }
  // disabled: <a class="btn disabled">Button</a>

  return (
    <div>
      <a className="waves-effect waves-light btn" onClick={start} >Start</a>
      <a className="waves-effect waves-light btn" onClick={stop} >Stop</a>
      <a className="waves-effect waves-light btn" onClick={reset} >Reset Round</a>
      <a className="waves-effect waves-light btn" onClick={start} >Reset Game</a>
      <a className="waves-effect waves-light btn" onClick={createTeams} >Create Teams</a>
    </div>
  )
}

export default ControlButtons;