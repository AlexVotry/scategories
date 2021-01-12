// shows the scategory list for each team.

import React, { useState, useContext } from 'react';
import CategoryContext from '../contexts/CategoryContext';
import UserContext from '../contexts/UserContext';
import { styles } from '../cssObjects';
import socket from '../service/socketConnection';

const GameSheet = () => {
  const list = useContext(CategoryContext);
  const {user} = useContext(UserContext);
  const { name, team } = user;
  // const answerSet = new Map();
  const [answers, setAnswers] = useState(new Map());
  const handleSubmit = () => {
    socket.emit('FinalAnswer', { answers, team });
    answers.clear();
    setAnswers(new Map());
  }

  const updateAnswer = (index, val) => {
    if (answers.has(index)) answers.delete(index);
    setAnswers(new Map(answers.set(index, val)));
    const guesses = {answers: [index, val], name };
    console.log(guesses);
    socket.emit('newGuess', guesses);
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
              onChange={e => updateAnswer(index,  e.target.value)}
            />
          </div>
        </li>
      )
    })
  }

  return (
    <form onSubmit={handleSubmit}>
    <div className="row">
      <ol className="col s4">
        {listForm()}
      </ol>
    </div>
    </form>
  )
};

export default GameSheet;
