import React, {useContext} from 'react';
import TimerContext from '../contexts/TimerContext';


const Timer = () => {
  const timer = useContext(TimerContext);

  return (
    <div>Timer: {timer} </div>
  )
};

export default Timer;