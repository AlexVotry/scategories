// first page to be seen, 

import React from 'react';

import Letter from './Letter';
import CategoryList from './CategoryList';
import Timer from './Timer';
import ControlButtons from './ControlButtons';
import Settings from './Settings';
import TeamList from './TeamList';

const OpeningPage = () => {

  return (
    <div className ="row">
        <Letter/>
        <CategoryList />
        <div className ="col s4">
          <Timer/>
          <ControlButtons/>
          <TeamList/>
          <Settings />
        </div>
    </div>
  );
};

export default OpeningPage;