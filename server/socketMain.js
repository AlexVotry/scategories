const mongoose = require('mongoose');
// const { User } = require('./models');
const { mongoUrl } = require('./secrets');

const handleGame = require('./services/handleGame');
const { handleAnswers, getFinalAnswers, compareTeamAnswers, updateScores} = require('./services/handleAnswers');
const {createMockTeams, createTeams } = require('./services/createTeams');
const {keysIn , isEqual} = require('lodash');
const uri = mongoUrl;


mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const db = require('./models');
let teams = {};
const players = [];
let totalPlayers;
let totalTeams;
let counter = 10;
let myTeam;
let numOfCategories = 6;
let teamNames;
let count = totalPlayers;

function socketMain(io, socket) {
  let room = '';

  socket.on('joinTeam', async formInfo => {
    const {name, group, admin} = formInfo;

    socket.join(group);
    room = group;
    console.log(`${name} joined ${group}`);
    const currentUser = await addUserToGroup(formInfo);
    socket.emit('currentUser:', currentUser);
  });

  socket.on('createTeams', async data => {
    const newTeams = teams = await createMockTeams(players);
    totalPlayers = count = players.length;
    totalTeams = Object.keys(newTeams).length;
    teamNames = keysIn(newTeams);
    io.to(room).emit('newTeams', newTeams);
  });

  socket.on('changeGameState', (gameState) => {
    io.to(room).emit('gameState', gameState);
    if (gameState === 'running') {
      teamNames.forEach(name => {
        teams[name].splice(-1, 1, 0);
      });
    };
    handleGame(io, socket, room, gameState, counter);
  });

  // during active play join (team); between play join (room);
  socket.on('myTeam', team => {
    socket.join(team);
    myTeam = team;
  });

  socket.on('newGuess', newGuesses => {
    const { guesses, team } = newGuesses;
    io.to(team).emit('updateAnswers', guesses);
  });
  
  socket.on('newMessage', messages => {
    io.to(messages.team).emit('updateMessage', messages);
  });
  
  socket.on('FinalAnswer', async finalAnswers => {  
    await handleAnswers(finalAnswers);
    count--;
    if (!count) {
      const teamAnswers = await getFinalAnswers(teamNames);
      const finalAnswers = await compareTeamAnswers(teamAnswers, numOfCategories)
      console.log('allsubs');
      io.to(room).emit('AllSubmissions', finalAnswers);
      count = totalPlayers;
    }
  });

  socket.on('updateScores', async teamScores => {
    const { score, team} = teamScores;
    const currentTeam = teams[team];
    const currentScore = currentTeam.slice(-1)[0];
    
    if ( currentScore !== score) {
      currentTeam.splice(-1, 1, score);
      await updateScores(teamScores);
    } 
  });
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

