// displays the letter we use to choose the words for scategory list

import React, {useState, useContext} from 'react';
import LetterContext from '../contexts/LetterContext';

const Letter = (): JSX.Element => {
  const currentLetter = useContext(LetterContext);

  return (
    <div>{currentLetter}</div>
  );
};

export default Letter;