//group of buttons.

import React, {useContext} from 'react';
import { isEmpty } from 'lodash';
import UserContext from '../contexts/UserContext';
import TeamsContext from '../contexts/TeamsContext';
import GameStateContext from '../contexts/GameStateContext';
import socket from '../service/socketConnection';
import { styles } from '../cssObjects';

const ControlButtons = () => {
  const gameState = useContext(GameStateContext);
  const {user} = useContext(UserContext);
  const teams = useContext(TeamsContext);
  let teamBtn = {display: 'inline-block'};
  let otherBtns = {display: 'none'};

  if (!isEmpty(teams)) {
    teamBtn = {display: 'none'};
    otherBtns = {display: 'inline-block'};
  }

  const runningBtns = {
    ...styles.btnRunning,
    otherBtns
  }
  const btnStyle = gameState === 'running' ? runningBtns : otherBtns;

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
    <div className="btnGroup">
      <a className="waves-effect waves-light btn" onClick={start} style={btnStyle}>Start</a>
      <a className="waves-effect waves-light btn" onClick={stop} style={btnStyle}>Stop</a>
      <a className="waves-effect waves-light btn" onClick={reset} style={btnStyle}>Reset Round</a>
      <a className="waves-effect waves-light btn disabled" onClick={start} style={btnStyle}>Reset Game</a>
      <a className="waves-effect waves-light btn" onClick={createTeams} style={teamBtn} >Create Teams</a>
    </div>
  )
}

export default ControlButtons;