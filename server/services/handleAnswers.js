const mongoose = require('mongoose');
const { uniqWith, isEqual, each } = require('lodash');
const { mongoUrl } = require('../secrets');

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const db = require('../models');

async function handleAnswers (answer) {
  const team = {
    name: answer.team,
    answers: new Map(JSON.parse(answer.answers))
  }

  const finalAnswers = await addTeam(team);
  return finalAnswers;
}

async function getFinalAnswers (allAnswers) {
  const { name, answers } = allAnswers;
  const ansObj = {};
  const finalBest = new Map();
  answers.forEach(answer => {
    answer.forEach((value, key) => {
      let k = key.substring(0,2);
      if (ansObj.hasOwnProperty(k)) {
        ansObj[k].push(value);
      } else {
        let array = [value];
        ansObj[k] = array;
      }
    })

  });

  for(const [key, value] of Object.entries(ansObj)) {
    const popularAnswer = bestAnswer(value);
    finalBest.set(key, popularAnswer);
  };
  console.log('finalBest:', finalBest);
// return finalBest;
  const result = await sendBestAnswer({name, finalBest})

  return { name: result.name, answers: result.finalAnswers };

}

function addTeam(team) {
  return new Promise((resolve, reject) => {
    db.Team.findOneAndUpdate(
      { name: team.name },
      { $push: { answers: team.answers } },
      { upsert: true, new: true },
      (err, doc) => {
        if (err) {
          throw err;
          reject(err);
        } else {
          resolve(doc);
        }
      })
  })
}
function sendBestAnswer(team) {
  return new Promise((resolve, reject) => {
    db.Team.findOneAndUpdate(
      { name: team.name },
      { finalAnswers: team.finalBest },
      { upsert: true, new: true },
      (err, doc) => {
        if (err) {
          throw err;
          reject(err);
        } else {
          resolve(doc);
        }
      })
  })
}

function bestAnswer(arr) {
  const obj = {};
  let max =arr[0];
  arr.forEach(ans => {
    if (obj[ans]) {
      obj[ans]++;
    } else {
      obj[ans] = 1;
    };
    max = obj[max] < obj[ans] ? ans : max;
  });

  return max;
}

module.exports = { handleAnswers, getFinalAnswers };