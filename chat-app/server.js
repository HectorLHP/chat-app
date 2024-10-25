const net = require('node:net');

const server = net.createServer();

server.on('connection', (socket) => {
  console.log('A new connection to the server');

  socket.on('data', (data) => {
    console.log(data.toString());
  });
});

server.listen(3008, '127.0.0.1', () => {
  console.log('Opened server on', server.address());
});
