// const express = require('express');
// const cluster = require('cluster');
// const net = require('net');
const socketio = require('socket.io');
// const io_redis = require('socket.io-redis');
// const num_processors = require('os').cpus().length;
// const farmhash = require('farmhash');
const socketMain = require('./socketMain');
var express = require('express');
var app = express();
// var path = require('path');
var server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:5000'
  }
});
const PORT = process.env.PORT || 8181;


  server.listen(PORT, () => console.log(`Master listening on ${PORT}...`))
  io.on('connection', socket => {
    socketMain(io, socket);
  });

