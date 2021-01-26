// form to join team

import React, {useState, useContext} from 'react';
import socket from '../service/socketConnection';
import UserContext from '../contexts/UserContext';

const JoinTeam = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [group, setGroup] = useState('');
  const [admin, setAdmin] = useState(false);
  const [gActive, setGActive] = useState('');
  const [nActive, setNActive] = useState('');
  const [eActive, setEActive] = useState('');
  const user = useContext(UserContext);

  const handleChange = (e) => {
    setAdmin(e.target.checked);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.removeItem('userInfo');
    const formInfo = {name, email, group, admin};
    socket.emit('joinTeam', formInfo);
    user.update(formInfo);
    localStorage.setItem('userInfo', JSON.stringify(formInfo));
  }

  const checkPlaceholder = () => {
    console.log('go:', group);
    if (!group) setGActive('');
    if (!name) setNActive('');
    if (!email) setEActive('');
  }

  return (
    <div className="row joinTeam">

      <form className="col s5" onSubmit={handleSubmit}>
        <div className="input-field col s12">
          <input id="group"
            type="text"
            value={group}
            onFocus={() => setGActive('active')}
            onBlur={checkPlaceholder}
            onChange={e => setGroup(e.target.value)} />
          <label className={gActive} htmlFor="group">Group Name</label>
        </div>

        <div className="row">
          <div className="input-field col s12">
            <input id="first_name" 
              type="text"
              value={name}
              onFocus={() => setNActive('active')}
              onBlur={checkPlaceholder}
              onChange={e => setName(e.target.value)}/>
            <label className={nActive} htmlFor="first_name">First Name</label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s12">
            <input id="email" 
              type="email"
              value={email}
              onFocus={() => setEActive('active')}
              onBlur={checkPlaceholder}
              onChange={e => setEmail(e.target.value)}/>
            <label className={eActive} htmlFor="email">Email</label>
          </div>
        </div>

        <div>
          <p>
            <input className="with-gap" name="admin" type="checkbox" id="admin" onChange={handleChange}/>
            <label htmlFor="admin">Admin?</label>
          </p>
        </div>

        <input type="submit" value="Submit" />
      </form>

    </div>
  )

}

export default JoinTeam;
