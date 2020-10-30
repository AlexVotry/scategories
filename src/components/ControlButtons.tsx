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

  // disabled: <a class="btn disabled">Button</a>

  return (
    <div>
      <a className="waves-effect waves-light btn" onClick={start} >Start</a>
      <a className="waves-effect waves-light btn" onClick={stop} >Stop</a>
      <a className="waves-effect waves-light btn" onClick={reset} >Reset Round</a>
      <a className="waves-effect waves-light btn" onClick={start} >Reset Game</a>
    </div>
  )
}

export default ControlButtons;