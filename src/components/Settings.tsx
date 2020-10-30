import React, {useState, useEffect} from 'react';
import { styles } from '../cssObjects';
import JoinTeam from './JoinTeam';

const Settings = () => {
  const [openForm, setOpenForm] = useState(false);
  const [currentDisplay, setCurrentDisplay] = useState(styles.none);

  const exposeOtherButtons = () => {
    setCurrentDisplay(styles.bottomRight);
  }

  const handleClick = () => {
    setOpenForm(!openForm);
  }

  const showForm = () => {
    return openForm ? <JoinTeam/> : null;
  }

  return (
    <div  >
      <a className="btn-floating btn-large red" style={styles.bottomRight} onMouseEnter={exposeOtherButtons}>
        <i className="large material-icons">mode_edit</i>
      </a>
      <ul style={currentDisplay}>
        <li><a className="btn-floating red"><i className="material-icons" onClick={handleClick}>Join Team</i></a></li>
        <li><a className="btn-floating yellow darken-1"><i className="material-icons">alarm_add</i></a></li>
        <li><a className="btn-floating green"><i className="material-icons">Add Category</i></a></li>
        <li><a className="btn-floating blue"><i className="material-icons">Set Number of Categories</i></a></li>
      </ul>
    {showForm()}  
    </div >
  )
};

export default Settings;
