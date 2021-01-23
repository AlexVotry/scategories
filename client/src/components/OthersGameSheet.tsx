// shows the scategory list for each team.

import React, { useContext, useState, useEffect } from 'react';
import CategoryContext from '../contexts/CategoryContext';
import UserAnswersContext from '../contexts/UserAnswersContext';
import UserContext from '../contexts/UserContext';
import socket from '../service/socketConnection';
import {pad} from '../service/strings';
import {colors} from '../cssObjects';

const OthersGameSheet = (props) => {
  const list = useContext(CategoryContext);
  const userAnswers = useContext(UserAnswersContext);
  const {user} = useContext(UserContext);
  const [guesses, setGuesses] = useState(new Map());
  const [messages, setMessages] = useState([]);
  const answerStle = {
    backgroundColor: colors.White,
    color: colors.Red,
    width: "100%"
  }

  const handleChange = (e) => {
    const userAnswer = e.target.value;
    const temp = userAnswer.split('_');
    updateUserAnswers(temp[0], temp[1]);
  }

  const listForm = () => {
    return list.map((category, index) => {
      const guess = guesses.has(index) ? guesses.get(index) : '';
      
      return (
        <li key={index}>
          {displayGuess(guess, index)}
        </li>
      )
    })
  }
  
  const displayGuess = (guess, index) => {
    if (!guess) return;
    const label = index.toString();
    return (
      <>
        <input className="with-gap" style={answerStle} name={guess} value={`${index}_${guess}`} type="checkbox" id={label} onChange={handleChange} />
        <label htmlFor={label}>{guess}</label>
      </>
    )
  }

  const showMessages = () => {
    if (!messages.length) return;
    return messages.map((message, index) => {
      return <div key={`${props.name}_${index}`}>{message}</div>
    });
  }

  const updateUserAnswers = (i, value) => {
    const index = pad(i);
    const temp = userAnswers.userAnswers;
    if (temp.has(index)) temp.delete(index);
    temp.set(index, value);
    userAnswers.updateUA(temp);
  }

  const updateOtherAnswers = (index, value) => {
    if (guesses.has(index)) guesses.delete(index);
    setGuesses(new Map(guesses.set(index, value)));
  }
  
  useEffect(() => {
    socket.on('updateAnswers', newGuesses => {
      const { answers, name } = newGuesses;
      const index = answers[0];
      const value = answers[1];
      const i = parseInt(index.substring(0, 2));
      
      if (name === props.name) {
        updateOtherAnswers(i, value);
      } else if (name === user.name) {
        updateUserAnswers(i, value);
      }

    })

    socket.on('updateMessage', newMessages => {
      const { message, name } = newMessages;

      if (name === props.name) {
        setMessages(arr => [...arr, message]);
      }
    });
  }, [])

  return (
    <>
      <div className="row">
        <ol className="col s4">
          {listForm()}
        </ol>
      </div>
        <div>
          {showMessages()}
        </div>
    </>
  )
};

export default OthersGameSheet;
