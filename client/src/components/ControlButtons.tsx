//group of buttons.

import React, {useContext} from 'react';
// import ButtonContext from '../contexts/ButtonContext';
import UserContext from '../contexts/UserContext';
import socket from '../service/socketConnection';

type ControlButtonProps = {
  startGame: Function;
  stopGame: Function;
  resetEverything: Function;
}

const ControlButtons = () => {
  // const buttons = useContext(ButtonContext);
  const {user} = useContext(UserContext);

  const start = () => {
    // buttons.startGame();
    socket.emit('changeGameState', 'running');
  }
  const stop = () => {
    // buttons.stopGame();
    socket.emit('pushPause', 'paused');
  }
  const reset = () => {
    // buttons.resetEverything();
    socket.emit('changeGameState', 'reset');
  }

  const createTeams = () => {
    socket.emit('createTeams', true);
    // buttons.createTeams();
  }
  // disabled: <a class="btn disabled">Button</a>
  if (!user.admin) return <div></div>;
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