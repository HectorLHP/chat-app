const net = require('node:net');
const readline = require('readline/promises');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const moveCursor = (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

const clearLine = (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

const socket = net.createConnection(
  { host: '127.0.0.1', port: 3008 },
  async () => {
    console.log('Connected to server');

    const ask = async () => {
      const message = await rl.question('Enter a message > ');
      // move cursor 1 line up
      await moveCursor(0, -1);
      // clear current line where cursor is in
      await clearLine(0);

      socket.write(message);
    };
    ask();

    socket.on('data', async (data) => {
      await moveCursor();
      await clearLine();
      console.log(data.toString('utf-8'));

      ask();
    });
  }
);

socket.on('end', () => {
  console.log('Connection ended');
});

socket.on('error', (err) => {
  console.error(`Connection error: ${err.message}`);
  socket.end(); // Safely close the client if an error occurs
});
