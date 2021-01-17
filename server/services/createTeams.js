const mongoose = require('mongoose');
const { uniqWith, isEqual, each } = require('lodash');
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
        teams[team].push(...eachUser);
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

  // load into same team to test team websocket.
  while (unique.length) {
    let eachUser = unique.splice(0, 1);
    if (eachUser.length) {

      if (unique.length > 2) {
        eachUser[0].team = 'Purple';
        teams.Purple.push(...eachUser);
      } else {
        eachUser[0].team = 'Blue';
        teams.Blue.push(...eachUser);
      }
      await db.User.findOneAndUpdate({ name: eachUser[0].name },
        { team: eachUser[0].team }, (err, doc) => {
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