// create scategory list.

import React, { useContext, useEffect, useState } from 'react';
import CategoryContext from '../contexts/CategoryContext';
import FinalAnswersContext from '../contexts/FinalAnswersContext';
import UserContext from '../contexts/UserContext';
import socket from '../service/socketConnection';
import {pad} from '../service/strings';
import {colors, styles} from '../cssObjects';
import { isEmpty, isEqual } from 'lodash';
import { teamAnswer, categoryList } from '../data/categoryList.js';

const CategoryList = () => {
  // const list = categoryList;  //mock data
  // const finalAnswers = teamAnswer; //mock data
  const list = useContext(CategoryContext);
  const finalAnswers = useContext(FinalAnswersContext);
  const {user} = useContext(UserContext);
  const [score, setScore] = useState({});
  let teamAnswers = Object.keys(finalAnswers);
  const teamTotals = {};

  const makeHeaders = () => {
    return teamAnswers.map(team => {
      teamAnswers[team] = 0; // reset teamAnswer to 0 everytime we refresh.
      return (
        <th key={team} style={{ color: colors[team] }}>{team}</th>
      )
    })
  }

  const parseList = () => {
    return list.map((category, index) => {
      const i = pad(index);
      return (
        <tr className="categroyListItems" key={`${index}`}>
          <td>{category}</td>
          {showAnswers(index)}
        </tr>
      )
    });
  }

  const showAnswers = (i) => {
    const index = pad(i);
    if (!teamAnswers.length) return;
    return teamAnswers.map((team) => {
      const newMap = finalAnswers[team].answers;
      if (isEmpty(newMap)) return;
      let answer = newMap.has(index) ? newMap.get(index) : '';
      const styledAnswer = displayAnswer(answer, team);
      return (
        <td className="teamAnswers" key={`${team}_${index}`} style={{color: colors[team]}}>
          <button className="btn-small waves-effect waves-ripple" onClick={() => removePoint(team, index, answer)}><i className="material-icons">block</i></button>
          {styledAnswer}
        </td>
      );
    })
  }

  const removePoint = (team, index, answer) => {
    const ans = `!${answer}`;
    finalAnswers[team].answers.set(index, ans);
    teamTotals[team] = teamTotals[team] - 1;
    setScore(teamTotals);
    serialize();
    socket.emit('failedAnswer', finalAnswers);
    deserialize()
  }

  const serialize = () => {
    teamAnswers.forEach(team => {
      const teamAnswers = finalAnswers[team].answers;
      finalAnswers[team].answers = JSON.stringify(Array.from(teamAnswers.entries())); 
    })
  }

  const deserialize = () => {
    teamAnswers.forEach(team => {
      finalAnswers[team].answers = new Map(JSON.parse(finalAnswers[team].answers));
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
        <td className="teamTotals" key={team} style={{ color: colors[team] }}>
          <div>currentScore: { currentScore }</div>
          <div>TotalScore:{ total }</div>
        </td>
      )
    });
  }

  useEffect(() => {
    if (isEmpty(teamTotals)) return;
    const teamScore = ((teamTotals[user.team] || 0) + finalAnswers[user.team].score)
    socket.emit('updateScores', { score: teamScore, team: user.team });
  }, [score]);

  if (list.length) {
    return (
      <div className="categoryList">
        <table>
          <tbody>
            <tr>
              <th>Categories</th>
              {makeHeaders()}
            </tr>
            {parseList()}
            <tr>
              <td></td>
              {showTeamTotals()}
            </tr>
          </tbody>
        </table>
      </div>
    )
  } 
  return <div>Scattegories</div>

}

export default CategoryList;