import React, {useState, useContext} from 'react';
import {getLetter} from '../service/randomize';
import LetterContext from '../contexts/LetterContext';

const Letter = (): JSX.Element => {
  const currentLetter = useContext(LetterContext);

  return (
    <div>{currentLetter}</div>
  );
};

export default Letter;