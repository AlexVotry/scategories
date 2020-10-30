import React, {useContext} from 'react';
import CategoryContext from '../contexts/CategoryContext';

const CategoryList = () => {
  const list = useContext(CategoryContext);

  const parseList = () => {
    return list.map(category => {
      return <li key={category}>{category}</li>
    })
  }
  
  return (
    <ol>
      {parseList()}
    </ol>
  )
}

export default CategoryList;