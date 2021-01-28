const mongoose = require('mongoose');
// const { User } = require('./models');
const { mongoUrl } = require('./secrets');

const handleGame = require('./services/handleGame');
const { handleAnswers, getFinalAnswers, compareTeamAnswers, updateScores} = require('./services/handleAnswers');
const {createMockTeams, createTeams, getTeams } = require('./services/createTeams');
const {keysIn , isEqual} = require('lodash');
const uri = mongoUrl;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const db = require('./models');
let teams = {};
const players = [];
let totalPlayers;
let totalTeams;
let counter = 20;
let myTeam;
let numOfCategories = 6;
let teamNames;
let count = totalPlayers;
let teamGroup;

function socketMain(io, socket) {
  let room = '';

  socket.on('initJoin', async localState => {
    const {name, group, team } = localState;
    teamGroup = group;
    socket.join(group);
    socket.join(team);
    room = team;
    const currentTeams = await getTeams(group);
    teams = currentTeams;
    console.log(`${name} re-joined ${group} `);
    assignTeams(teams);
    socket.emit('initUser', { currentUser: localState, teams });
  });

  socket.on('joinTeam', async formInfo => {
    const {name, group} = formInfo;
    teamGroup = group;
    socket.join(group);
    room = group;
    console.log(`${name} joined ${group}`);
    const currentUser = await addUserToGroup(formInfo);
    socket.emit('currentUser', currentUser)
  });

  socket.on('createTeams', async data => {
    teams = await createMockTeams(players, teamGroup);
    totalPlayers = count = players.length;
    assignTeams(teams);
    io.to(room).emit('newTeams', teams);
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

  socket.on('failedAnswer', finalAnswers => {
    io.to(teamGroup).emit('AllSubmissions', finalAnswers)
  });

  function assignTeams(teams) {
    totalTeams = Object.keys(teams).length;
    teamNames = keysIn(teams);
  }
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

