// shows the scategory list for each team.

import React, { useContext, useState, useEffect } from 'react';
import CategoryContext from '../contexts/CategoryContext';
import OtherAnswersContext from '../contexts/OtherAnswersContext';
// import FinalAnswersContext from '../contexts/FinalAnswersContext';
import GameStateContext from '../contexts/GameStateContext';
import socket from '../service/socketConnection';
import {colors} from '../cssObjects';

const OthersGameSheet = (props) => {
  const list = useContext(CategoryContext);
  const gameState = useContext(GameStateContext);
  const otherAnswers = useContext(OtherAnswersContext);
  // const otherAnswers = useContext(OtherAnswersContext);
  const [guesses, setGuesses] = useState(new Map());
  const [messages, setMessages] = useState([]);
  const otherMessages = [];
  const answerStle = {
    backgroundColor: colors.White,
    color: colors.Red,
    width: "100%"
  }

  const listForm = () => {
    return list.map((category, index) => {
      const guess = guesses.has(index) ? guesses.get(index) : '';
      return (
        <li key={index}>
          <div style={answerStle}>{guess} </div>
        </li>
      )
    })
  }

  const showMessages = () => {
    // console.log(messages, 'showMessages')
    if (!messages.length) return;
    return messages.map((message, index) => {
      return <div key={`${props.name}_${index}`}>{message}</div>
    });
  }

  useEffect(() => {
    socket.on('updateAnswers', newGuesses => {
      console.log('newGuesses:', newGuesses)
      const { answers, name } = newGuesses;
      
      if (name === props.name) {
        const index = answers[0];
        const i = parseInt(index.substring(0,1));
        const value = answers[1];
       
        if (guesses.has(i)) guesses.delete(i);

        setGuesses(new Map(guesses.set(i, value)));
        const temp = otherAnswers.otherAnswers;
        if (temp.has(index)) temp.delete(index);
        temp.set(index, value);
        otherAnswers.updateOA(temp)
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
