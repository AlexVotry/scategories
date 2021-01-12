const mongoose = require('mongoose');
const { User } = require('./models');
const { mongoUrl } = require('./secrets');
const { uniqWith, isEqual } = require('lodash');
const handleGame = require('./services/handleGame');
const uri = mongoUrl;

const mockTeams = require('./data/mockTeams');

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const db = require('./models');
let teams = {};
const players = [];
let counter = 10;
let myTeam;

function socketMain(io, socket) {
  let room = '';

  socket.emit('teams', teams);

  socket.on('joinTeam', async formInfo => {
    const {name, group, admin} = formInfo;

    socket.join(group);
    room = group;
    console.log(`${name} joined ${group}`);
    const currentUser = await addUserToGroup(formInfo);
    socket.emit('currentUser:', currentUser);
  });

  socket.on('createTeams', async data => {
    const newTeams = await createTeams();
    io.to(room).emit('newTeams', newTeams);
  });

  socket.on('changeGameState', (gameState) => {
    io.to(room).emit('gameState', gameState);
    handleGame(io, socket, room, gameState, counter);
  });

  // during active play join (team); between play join (room);
  socket.on('myTeam', team => {
    socket.join(team);
    myTeam = team;
  });
  socket.on('newGuess', newGuesses => {
    console.log('newGuess:', newGuesses, myTeam);
    // const { answers, name, team } = newGuesses;
    // io.to(myTeam).emit('updateAnswers', newGuesses);
    io.to(room).emit('updateAnswers', newGuesses);
  });
}


const addUserToGroup = async user => {
  await db.User.findOneAndUpdate({ email: user.email},
    user, { upsert: true }, (err, doc) => {
      if (err) throw err;
      else {
        players.push(user);
      }
    })

    return user;
}

async function createTeams() {
  // teams = { Blue: [], Red: [], Green: [], Purple: [], Gold: [] };
  teams = mockTeams;
  
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
        await db.User.findOneAndUpdate({ email:  eachUser[0].email },
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

module.exports = socketMain;

