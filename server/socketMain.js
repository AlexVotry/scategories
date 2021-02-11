const mongoose = require('mongoose');
// const { User } = require('./models');
const { mongoUrl } = require('./secrets');

const {handleGame, pauseGame, resetGame } = require('./services/handleGame');
const { handleAnswers, getFinalAnswers, compareTeamAnswers, updateScores, resetScores} = require('./services/handleAnswers');
const {createMockTeams, createTeams, getTeams } = require('./services/createTeams');
const {keysIn , isEqual} = require('lodash');
const uri = mongoUrl;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const db = require('./models');
let teams = {};
const players = [];
let totalPlayers;
let totalTeams;
let timer = 20;
let myTeam;
let numOfCategories = 12;
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
    console.log('createTeams', data);
    io.to(room).emit('newTeams', teams);
  });

  socket.on('changeGameState', (gameState) => {
    const gState = gameState === 'startOver' ? 'ready' : gameState;
    io.to(room).emit('gameState', gState);
    handleGame(io, room, timer, numOfCategories, gameState);

    if (gameState === 'running') {
      // at start of game, add 0 to end of team.
      teamNames.forEach(name => {
        teams[name].splice(-1, 1, 0);
      });
    }
    if (gameState === 'startOver') {
      resetScores(teamGroup);
      io.to(room).emit('startOver', numOfCategories);
    }
  });

  socket.on('pushPause', pause => {
    pauseGame();
  });

  socket.on('reset', reset => {
    resetGame(timer);
    handleGame(io, room, timer, numOfCategories, 'running');
  })

  // during active play join (team); between play join (room);
  socket.on('myTeam', team => {
    console.log('team:', team)
    socket.join(team);
    myTeam = team;
  });

  // every guess goes to the teammates to see.
  socket.on('newGuess', newGuesses => {
    const { guesses, team } = newGuesses;
    io.to(team).emit('updateAnswers', guesses);
  });
  
  socket.on('newMessage', messages => {
    io.to(messages.team).emit('updateMessage', messages);
  });
  
  // times up! everyone submits answer. 
  socket.on('FinalAnswer', async finalAnswers => {  
    await handleAnswers(finalAnswers, teamGroup);
    count--;
    if (!count) {
      // determine best answer for each team
      const teamAnswers = await getFinalAnswers(teamGroup);
      // compare team's answer to each other and cross out duplicates.
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
      await updateScores(teamScores, teamGroup);
    } 
  });

  // if someone disagrees with an answer and the cross it out.
  socket.on('failedAnswer', finalAnswers => {
    io.to(teamGroup).emit('AllSubmissions', finalAnswers)
  });

  // settings button determine length of time and number of categories
  socket.on('gameChoices', gameChoices => {
    numOfCategories = gameChoices.categories || numOfCategories;
    timer = gameChoices.timer * 60;
  });

  function assignTeams(teams) {
    totalTeams = Object.keys(teams).length;
    teamNames = keysIn(teams);
  }
}

const addUserToGroup = async user => {
  await db.User.findOneAndUpdate(
    { name: user.name, group: user.group },
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

