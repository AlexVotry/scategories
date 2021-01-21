// create scategory list.

import React, { useContext, useEffect, useState } from 'react';
import CategoryContext from '../contexts/CategoryContext';
import FinalAnswersContext from '../contexts/FinalAnswersContext';
import UserContext from '../contexts/UserContext';
import socket from '../service/socketConnection';
import {colors, styles} from '../cssObjects';
import { isEmpty, isEqual } from 'lodash';
import { teamAnswer, categoryList } from '../data/categoryList.js';

const CategoryList = () => {
  // const list = categoryList;
  // const finalAnswers = teamAnswer;
  const list = useContext(CategoryContext);
  const finalAnswers = useContext(FinalAnswersContext);
  const {user} = useContext(UserContext);
  const [score, setScore] = useState({});
  let teamAnswers = Object.keys(finalAnswers);
  const teamTotals = {};

  const parseList = () => {
    console.log('parse');
    return list.map((category, index) => {
      const i = pad(index);
      return (
        <li key={`${index}`}>
          <div >{category}</div>
        {showAnswers(index)}
        </li>
      )
    });
  }

  const showAnswers = (i) => {
    const index = pad(i);
    if (!teamAnswers.length) return;
    return teamAnswers.map((team) => {
      const newMap = finalAnswers[team].answers;
      let answer = newMap.has(index) ? newMap.get(index) : '';
      answer = displayAnswer(answer, team);
      return <span key={`${team}_${answer}_${index}`} style={{color: colors[team]}}> -- {answer}</span>
    })
  }

  const displayAnswer = (answer, team) => {
    if (answer.startsWith('!')) {
      return <s>{answer.substring(1)}</s>
    } else {
      if (answer.length) {
        if (teamTotals.hasOwnProperty(team)) {
          teamTotals[team] = teamTotals[team] + 1;
        } else {
          teamTotals[team] = 1;
        }
      }
      return <strong>{answer}</strong>;
    }
  }

  const showTeamTotals = () => {
    if (!isEqual(teamTotals, score)) {
      setScore(teamTotals);

    }
    return teamAnswers.map(team => {
      const currentScore = teamTotals[team] || 0;
      const total = finalAnswers[team].score + (currentScore);
      return (
        <>
          <div key={team}>{team}  currentScore: { currentScore } TotalScore:{ total }</div>
        </>
      )
    });
  }
  useEffect(() => {
    if (isEmpty(teamTotals)) return;
    console.log('useEffect', { score: teamTotals[user.team], team: user.team })
    socket.emit('updateScores', { score: teamTotals[user.team], team: user.team }); 
  }, [score]);
  

  function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
  }
  
  return (
    <>
    <ol>
      {parseList()}
    </ol>
      {showTeamTotals()}
    </>
  )
}

export default CategoryList;