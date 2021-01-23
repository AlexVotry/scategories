const mongoose = require('mongoose');
const { uniqWith, isEqual, includes, remove, uniqBy } = require('lodash');
const mockTeams = require('../data/mockTeams');
const { mongoUrl } = require('../secrets');

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const db = require('../models');


async function createTeams(players) {
  let teams = { Blue: [], Red: [], Green: [], Purple: [], Gold: [] };

  const unique = uniqWith(players, isEqual);
  const len = unique.length;
  let noOfTeams = 0;

  if (len < 6) {
    noOfTeams = len;
  }
  if (len > 9) {
    noOfTeams = 5;
  } else {
    noOfTeams = Math.floor(len / 2);
  }

  while (unique.length) {
    for (let team in teams) {
      let eachUser = unique.splice(0, 1);
      if (eachUser.length) {
        eachUser[0].team = team
        if (!teams[team].includes(eachUser[0])) {
          teams[team].push(...eachUser);
        }
        await db.User.findOneAndUpdate({ email: eachUser[0].email },
          { team: team }, (err, doc) => {
            if (err) throw err;
            else {
              eachUser = [];
            }
          }
        );
      }
    }
  }

  return teams;
}

async function createMockTeams(players) {
  let teams = mockTeams;
  console.log('blue:', teams.Blue)
  teams.Blue = [];
  const unique = uniqBy(players, 'name');
  const len = unique.length;
  let noOfTeams = 0;

  if (len < 6) {
    noOfTeams = len;
  }
  if (len > 9) {
    noOfTeams = 5;
  } else {
    noOfTeams = Math.floor(len / 2);
  }

  // load into same team to test team websocket.
  while (unique.length) {
    let eachUser = unique.splice(0, 1);
    if (eachUser.length) {
      const curUser = eachUser[0];

      if (unique.length > 2) {
        eachUser[0].team = 'Red';
        if (!includes(teams.Red, curUser.name)) {
          teams.Red.push(...eachUser);
        }
      } else if (eachUser[0].name) {
        eachUser[0].team = 'Blue';
        if (includes(teams.Blue, curUser.name)) {
          console.log( teams.Blue, )
          remove(teams.Blue, player => player.name === curUser.name)
        }
        teams.Blue.push(...eachUser);
      }
      await db.User.findOneAndUpdate({ name: curUser.name },
        { team: curUser.team }, (err, doc) => {
          if (err) throw err;
          else {
            eachUser = [];
          }
        }
      );
    }
  }

  return teams;
}

module.exports = { createMockTeams, createTeams };