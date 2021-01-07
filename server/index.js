const express = require('express');
const cluster = require('cluster');
const net = require('net');
const socketio = require('socket.io');
const io_redis = require('socket.io-redis');
const num_processors = require('os').cpus().length;
const farmhash = require('farmhash');
const socketMain = require('./socketMain');

const PORT = process.env.PORT || 8181;

if (cluster.isMaster) {
  let workers = [];

  let spawn = i => {
    workers[i] = cluster.fork();
    workers[i].on('exit', (code, signal) => {
      spawn(i);
    });
  };

  for (let i = 0; i < num_processors; i++) {
    spawn(i);
  }
  const worker_index = (ip, len) => farmhash.fingerprint32(ip) % len;

  const server = net.createServer({ pauseOnConnect: true }, connection => {
    let worker = workers[worker_index(connection.remoteAddress, num_processors)];
    worker.send('sticky-session:connection', connection);
  });

  server.listen(PORT, () => console.log(`Master listening on ${PORT}...`))
} else {
  let app = express();
  const server = app.listen(0, 'localhost');
  const io = socketio(server, {
    cors: {
      origin: 'http://localhost:5000'
    }
  });

  io.adapter(io_redis());
  io.on('connection', socket => {
    socketMain(io, socket);
    console.log(`connected to worker: ${cluster.worker.id}`);
  });

  process.on('message', (message, connection) => {
    if (message !== 'sticky-session:connection') return;
    server.emit('connection', connection);
    connection.resume();
  });

}