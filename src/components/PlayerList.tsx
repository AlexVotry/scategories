import React, {useContext} from 'react';
import CategoryContext from '../contexts/CategoryContext';
import LetterContext from '../contexts/LetterContext';

const PlayerList = () => {
  const currentLetter = useContext(LetterContext);
  const list = useContext(CategoryContext);

  const listForm = () => {
    return list.map((category, index) => {
      return (
        <li key={category}>
          {category}
          <div className="input-field inline">
            <input id={`cat_${index}`} />
          </div>
        </li>
      )
    })
  }

  return (
    <div className="row">
      <ol className="col s4">
        {listForm()}
      </ol>
    </div>
  )
};

export default PlayerList;
