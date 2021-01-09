const mongoose = require('mongoose');
const { toUnicode } = require('punycode');
const { User } = require('./models');
const { mongoUrl } = require('./secrets');
const _ = require('lodash');
const uri = mongoUrl;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const db = require('./models');
const teams = { Blue: [], Red: [], Green: [], Purple: [], Gold: [] };
const players = [];

function socketMain(io, socket) {
  let room = '';
  socket.emit('teams', teams);

  socket.on('joinTeam', async formInfo => {
    const {name, group, admin} = formInfo;

    socket.join(group);
    room = group;
    console.log(`${name} joined ${group}`);
    const currentUser = await addUserToGroup(formInfo);
    console.log('cur:', currentUser);
    socket.emit('currentUser:', currentUser);
  });

  socket.on('createTeams', async data => {
    const newTeams = await createTeams();
    io.to(room).emit('newTeams', newTeams);
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
  console.log('players:', players);
  const unique = _.uniqWith(players, _.isEqual);
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

