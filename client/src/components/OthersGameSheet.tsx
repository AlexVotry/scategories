// shows the scategory list for each team.

import React, { useContext, useState, useEffect } from 'react';
import CategoryContext from '../contexts/CategoryContext';
import socket from '../service/socketConnection';
import {colors} from '../cssObjects';

const OthersGameSheet = (props) => {
  const list = useContext(CategoryContext);
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
    console.log(messages, 'showMessages')
    if (!messages.length) return;
    return messages.map((message, index) => {
      return <div key={`${props.name}_${index}`}>{message}</div>
    });
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
