// create scategory list.

import React, {useContext} from 'react';
import CategoryContext from '../contexts/CategoryContext';
import FinalAnswersContext from '../contexts/FinalAnswersContext';
import {isEqual, uniqWith} from 'lodash';
import {colors, styles} from '../cssObjects';

const CategoryList = () => {
  const list = useContext(CategoryContext);
  const finalAnswers = useContext(FinalAnswersContext);
  let teamAnswers = [];

  const parseList = () => {
    return list.map((category, index) => {
      return (
        <>
         <li>
          <div key={`${index}_${category}`}>{category}</div>
          {/* {showAnswers(index)} */}
         </li>
        </>
      )
    })
  }

  const showAnswers = (index) => {
    parseTeams();
    if (!teamAnswers.length) return;
    const uniqueAnswers = uniqWith(teamAnswers, isEqual);
    return uniqueAnswers.map(({team, newMap}) => {
      const answer = newMap.has(index) ? newMap.get(index) : '';
      return <span key={`${team}_${answer}_${index}`} style={{color: colors[team]}}> -- {answer}</span>
    })
  }

  const parseTeams = () => {
    for (let team in finalAnswers) {
      const newMap = new Map(JSON.parse(finalAnswers[team]));
      teamAnswers = [...teamAnswers, {team, newMap} ];
    }
  }
  
  return (
    <ol>
      {/* {parseList()} */}
    </ol>
  )
}

export default CategoryList;