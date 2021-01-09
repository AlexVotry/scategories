// form to join team

import React, {useState, useContext} from 'react';
import socket from '../service/socketConnection';
import UserContext from '../contexts/UserContext';

const JoinTeam = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [group, setGroup] = useState('');
  const [admin, setAdmin] = useState(false);
  const user = useContext(UserContext);

  const handleChange = (e) => {
    setAdmin(e.target.checked);
  }

  const handleSubmit = (e) => {
    const formInfo = {name, email, group, admin}
    socket.emit('joinTeam', formInfo);
    user.update(formInfo);
    e.preventDefault();
  }

  return (
    <div className="row">

      <form className="col s12" onSubmit={handleSubmit}>
        <div className="input-field col s6">
          <input id="group"
            type="text"
            value={group}
            onChange={e => setGroup(e.target.value)} />
          <label htmlFor="group">Group Name</label>
        </div>

        <div className="row">
          <div className="input-field col s6">
            <input id="first_name" 
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}/>
            <label htmlFor="first_name">First Name</label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col s6">
            <input id="email" 
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}/>
            <label htmlFor="email">Email</label>
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
