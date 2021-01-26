// shows the scategory list for each team.

import React, { useState, useContext, useEffect } from 'react';
import CategoryContext from '../contexts/CategoryContext';
import UserContext from '../contexts/UserContext';
import { colors, styles } from '../cssObjects';
import socket from '../service/socketConnection';
import { pad } from '../service/strings';

const GameSheet = () => {
  const list = useContext(CategoryContext);
  const {user} = useContext(UserContext);
  const { name, team } = user;
  const [answers, setAnswers] = useState(new Map());
  const [message, setMessage] = useState('');
  const [active, setActive] = useState('');

  const messageBackground = {
    color: colors[user.team],
    backgroundColor: 'white',
    marginTop: '10px'
  }
  const catList = {
    ...styles.flexRow,
    alignItems: 'center'
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  const updateAnswer = (index, val) => {
    if (answers.has(index)) answers.delete(index);
    setAnswers(new Map(answers.set(index, val)));
    const guesses = { answers: [`${pad(index)}_${name}`, val], name };
    socket.emit('newGuess', {guesses, team});
  }

  const updateMessage = e => {
    e.preventDefault();
    socket.emit('newMessage', {message, name, team});
    setMessage('');
  }

  const listForm = () => {
    return list.map((category, index) => {
      return (
        <li className="gameSheetListItem" style={catList} key={category} >
          <div className="category" style={{width: '50%'}}>{category}</div>
          <div className="input-field inline" style={{ width: '40%'}}>
            <input
              style={messageBackground}
              id={`cat_${index}`}
              type="text"
              value={answers[index]}
              onChange={e => updateAnswer(index, e.target.value)}
            />
          </div>
        </li>
      )
    })
  }

  const checkPlaceholder = () => {
    if (!message) setActive('');
  }

  return (
    <div className="gameSheet" style={{padding: '10px'}}>
      <form className="messageForm" onSubmit={updateMessage}>
        <div className="input-field">
          <i className="material-icons prefix" style={{marginTop: '10px'}}>chat</i>
          <input
            style ={messageBackground}
            id='messageText'
            type="text"
            value={message}
            onFocus={() => setActive('active')}
            onBlur={checkPlaceholder}
            onChange={e => setMessage(e.target.value)}
            />
          <label className={active} htmlFor='messageText'style={styles.messageLabel}>Send a message</label>
        </div>
      </form>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <ol>
            {listForm()}
          </ol>
        </div>
      </form>
    </div>
  )
};

export default GameSheet;
