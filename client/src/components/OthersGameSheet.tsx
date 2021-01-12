// shows the scategory list for each team.

import React, { useContext, useState, useEffect } from 'react';
import CategoryContext from '../contexts/CategoryContext';
import socket from '../service/socketConnection';

const OthersGameSheet = (props) => {
  const list = useContext(CategoryContext);
  const [guesses, setGuesses] = useState(new Map());

  const listForm = () => {
    return list.map((category, index) => {
      const guess = guesses.has(index) ? guesses.get(index) : '';
      return (
        <li key={index}>
          {category} -- {guess[index]}
        </li>
      )
    })
  }

  useEffect(() => {
    socket.on('updateAnswers', newGuesses => {
      const { answers, name } = newGuesses;
      
      if (name === props.name) {
        // answer[0] = index, answer[1] = value;
        if (guesses.has(answers[0])) guesses.delete(answers[0]);
        setGuesses(new Map(guesses.set(answers[0], answers[1])));
      }
    })
  }, [])

  return (
    <div className="row">
      <ol className="col s4">
        {listForm()}
      </ol>
    </div>
  )
};

export default OthersGameSheet;
