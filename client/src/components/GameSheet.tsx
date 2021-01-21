// shows the scategory list for each team.

import React, { useState, useContext, useEffect } from 'react';
import CategoryContext from '../contexts/CategoryContext';
import UserContext from '../contexts/UserContext';
import TimerContext from '../contexts/TimerContext';
import UserAnswersContext from '../contexts/UserAnswersContext';
import OtherAnswersContext from '../contexts/OtherAnswersContext';
import { styles } from '../cssObjects';
import socket from '../service/socketConnection';

const GameSheet = () => {
  const list = useContext(CategoryContext);
  const {user} = useContext(UserContext);
  const userAnswers = useContext(UserAnswersContext);
  const otherAnswers = useContext(OtherAnswersContext);
  const timer = useContext(TimerContext);
  const { name, team } = user;
  const [answers, setAnswers] = useState(new Map());
  const [message, setMessage] = useState('');

  // const autoSubmit = () => {
  //   console.log('timer:', timer);
  //   if (timer > 0) return;
  //     assembleUserAnswers();
  // }
  // const assembleUserAnswers = () => {
  //   // const final = JSON.stringify(Array.from(answers.entries()));
  //   // socket.emit('FinalAnswer', { [team]: final });
  //   userAnswers.updateUA(answers);
  //   console.log('gameshte;', userAnswers, otherAnswers);
  //   answers.clear();
  //   setAnswers(new Map());
  // }

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
        <li key={category} style={styles.flexRow}>
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
          <ol className="col s4">
            <input type="submit" value="Submit" />
            {listForm()}
          </ol>
        </div>
      </form>
    </>
  )
};

export default GameSheet;
