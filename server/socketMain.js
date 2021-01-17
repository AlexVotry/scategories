const mongoose = require('mongoose');
// const { User } = require('./models');
const { mongoUrl } = require('./secrets');

const handleGame = require('./services/handleGame');
const {handleAnswers, getFinalAnswers} = require('./services/handleAnswers');
const {createMockTeams, createTeams } = require('./services/createTeams');
const uri = mongoUrl;


mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const db = require('./models');
let teams = {};
const players = [];
let totalPlayers;
let totalTeams;
let counter = 10;
let myTeam;
// const answer = [];

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
    const newTeams = await createMockTeams(players);
    totalPlayers = players.length;
    totalTeams = Object.keys(newTeams).length;
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
    io.to(myTeam).emit('updateAnswers', newGuesses);
  });
  
  socket.on('newMessage', messages => {
    io.to(myTeam).emit('updateMessage', messages);
  });
  
  socket.on('FinalAnswer', async finalAnswers => {
    let allAnswers;
    const allTeamAnswers = {}
    allAnswers = await handleAnswers(finalAnswers, totalPlayers);
    totalPlayers--;
    if (!totalPlayers) {
      const team = await getFinalAnswers(allAnswers);
      allTeamAnswers[team.name] = team.answers;
      totalTeams--;
      console.log('teamAsnwer:', teamAnswers);
      if (!totalTeams) {
        // const finalAnswers = await compareTeamAnswers(allTeamAnswers)
      }
    }
    // io.to(room).emit('AllSubmissions', finalAnswers);
  })
}


const addUserToGroup = async user => {
  await db.User.findOneAndUpdate(
    { name: user.name},
    user, 
    { upsert: true }, 
    (err, doc) => {
      if (err) throw err;
      else {
        players.push(user);
      }
    })

    return user;
}

module.exports = socketMain;

