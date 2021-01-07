const mongoose = require('mongoose');
const { toUnicode } = require('punycode');
const { User } = require('./models');
const uri = "mongodb+srv://alexVotry:$category@cluster0.r7i2f.mongodb.net/scattegories?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = require('./models');
const teams = { Blue: [], Red: [], Green: [], Purple: [], Gold: [] };
const players = [];

function socketMain(io, socket) {
  socket.emit('data', teams);

  socket.on('joinTeam', formInfo => {
    const {name, group, admin} = formInfo;

    socket.join(group);
    console.log(`${name} joined ${group}`);
    addUserToGroup(formInfo);
  });

  socket.on('createTeams', async data => {
    const newTeams = await createTeams();
    console.log('newteams:', newTeams);
    socket.emit('newTeams', newTeams);
  });
}

function addUserToGroup(user) {
  return new Promise((resolve, reject) => {
    db.User.findOne({name: user.name, email: user.email},
      (err, doc) => {
        if(err) {
          throw err;
          reject(err);
         } else {
          if (doc === null) {
            let newUser = new User(user);
            newUser.save();
            resolve('added');
          } else {
            // need to update user.admin here.
            resolve('found');
          }
          players.push(user.name);
          const currentUser = {player: user.name, admin: user.admin};
          socket.emit('currentUser:', currentUser);
        }
      })
  });
}

function createTeams() {
  console.log('players:', players);
  const unique = players.filter(onlyUnique);
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
      const eachTeam = unique.splice(0, 1);
      teams[team].push(...eachTeam);
    }
  }

 return teams;
}

const onlyUnique = (value, index, self) => self.indexOf(value) === index;

module.exports = socketMain;