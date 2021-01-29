// displays the timer.

import React, {useContext} from 'react';
import TimerContext from '../contexts/TimerContext';


const Timer = () => {
  const timer = useContext(TimerContext);

  return (
    <div className="timer">
      <div style={{float: 'right'}}>{timer}</div>
    </div>
  )
};

export default Timer;