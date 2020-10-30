import React from 'react';

import Letter from './Letter';
import CategoryList from './CategoryList';
import Timer from './Timer';
import ControlButtons from './ControlButtons';
import Settings from './Settings';
// import LetterContext from '../contexts/LetterContext';
// import CategoryContext from '../contexts/CategoryContext';


const OpeningPage = () => {

  return (
    <div className ="row">
      {/* <div className ="row"> */}
        <Letter/>
        <CategoryList />
        <div className ="col s4">
          <Timer/>
          <ControlButtons/>
          <Settings />
        </div>
      {/* </div> */}
    </div>
  );
};

export default OpeningPage;