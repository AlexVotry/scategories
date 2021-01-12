const getLetter = (letters) => {
  const index = getRandom(letters.length);
  const currentLetter = letters[index];

  // return the currentLetter and remove is from the array.
  return [currentLetter, letters.splice(index, 1)];
};

const getCategories = (categoryList, numberOfCategories) => {
  const list = [];
  for (let i = 0; i < numberOfCategories; i++) {
    const index = getRandom(categoryList.length);
    list.push(categoryList[index]);
    categoryList.splice(index, 1);
  }
  
  return [list, categoryList];
};


function getRandom(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

module.exports = { getLetter, getCategories };