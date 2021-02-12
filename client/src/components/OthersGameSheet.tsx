// shows the scategory list for each team.

import React, { useContext, useState, useEffect, useRef } from 'react';
import CategoryContext from '../contexts/CategoryContext';
import UserAnswersContext from '../contexts/UserAnswersContext';
import UserContext from '../contexts/UserContext';
import socket from '../service/socketConnection';
import {pad} from '../service/strings';
import { updateUserAnswers } from '../service/updateAnswers';
import {colors} from '../cssObjects';

const OthersGameSheet = (props) => {
  const userAnswers = useContext(UserAnswersContext);
  const {user} = useContext(UserContext);
  const [list, setList] = CategoryContext.useCategpry();
  const [guesses, setGuesses] = useState(new Map());
  const [isChecked, setIsChecked] = useState({})
  const webSocket = useRef(null);
 
  const answerStyle = {
    backgroundColor: colors.White,
    color: colors.Red,
    width: "100%"
  }
  
  const handleChange = (e) => {
    const userAnswer = e.target.value;
    const arr = userAnswer.split('_');
    const val = arr[1].split('^');
    const checked = {...isChecked, [arr[0]]: e.target.checked};
    setIsChecked(() => (checked));
    if (e.target.checked) {
      updateUserAnswers(arr[0], val[1]);
    } 
  }

  const listForm = () => {
    return list.map((category, i) => {
      const index = `${pad(i)}_${props.name}`;
      const guess = guesses.has(index) ? guesses.get(index) : '';
      
      return (
        <li className="otherGameSheetListItem" key={i}>
          {displayGuess(guess, index)}
        </li>
      )
    })
  }
  
  const displayGuess = (guess, index) => {
    if (!guess) return;
    const highlight = isChecked[index] ? { color: 'white'} : {};
    return (
      <>
        <input className="with-gap" style={answerStyle} name={guess} value={`${index}^${guess}`} type="checkbox" id={index} onChange={e => handleChange(e)} />
        <label style={highlight} htmlFor={index}>{guess}</label>
      </>
    )
  }
  const updateUserAnswers = (i: number, value: string) => {
    const index = pad(i);
    const temp = userAnswers.userAnswers;
    if (temp.has(index)) temp.delete(index);
    temp.set(index, value);
    userAnswers.updateUA(temp);
  }

  const updateOtherAnswers = (index: number, value: string) => {
    if (guesses.has(index)) guesses.delete(index);
    setGuesses(new Map(guesses.set(index, value)));
  }
  
  useEffect(() => {
      console.log('othGamSht')
      updateUserAnswers(42, 'no answer');
      socket.on('updateAnswers', newGuesses => {
        console.log('updateAnswer', newGuesses)
        const { answers, name } = newGuesses;
        const index = answers[0];
        const value = answers[1];
        if (name === props.name) {
          updateOtherAnswers(index, value);
        } else if (name === user.name) {
          updateUserAnswers(index, value);
        }
      })
    return () => socket.off('updateAnswers', 'off')
  }, [])

  return (
    <ol className="gameSheet">
      {listForm()}
    </ol>
  )
};

export default OthersGameSheet;
