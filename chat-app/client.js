const net = require('node:net');
const readline = require('readline/promises');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const socket = net.createConnection(
  { host: '127.0.0.1', port: 3008 },
  async () => {
    console.log('Connected to server');

    const message = await rl.question('Enter a message > ');

    socket.write(message);
  }
);

socket.on('end', () => {
  console.log('Connection ended');
});

socket.on('error', (err) => {
  console.error(`Connection error: ${err.message}`);
  socket.end(); // Safely close the client if an error occurs
});
