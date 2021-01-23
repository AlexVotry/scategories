// shows the scategory list for each team.

import React, { useState, useContext, useEffect } from 'react';
import CategoryContext from '../contexts/CategoryContext';
import UserContext from '../contexts/UserContext';
import { styles } from '../cssObjects';
import socket from '../service/socketConnection';

const GameSheet = () => {
  const list = useContext(CategoryContext);
  const {user} = useContext(UserContext);
  const { name, team } = user;
  const [answers, setAnswers] = useState(new Map());
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
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
        <li key={category} >
          {category}
          <div className="input-field inline">
            <input
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

  return (
    <>
      <form onSubmit={updateMessage}>
        <input
          id={`message`}
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
      </form>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <ol>
            {listForm()}
          </ol>
        </div>
      </form>
    </>
  )
};

export default GameSheet;
