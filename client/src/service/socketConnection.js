import io from 'socket.io-client';
let socket = io.connect('http://localhost:8181');

socket.emit('group', 'IntegralGIS');

export default socket;