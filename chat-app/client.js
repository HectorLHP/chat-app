const net = require('node:net');
const readline = require('readline/promises');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const clearLine = (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

const moveCursor = (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};
let id;

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

      socket.write(`${id}-message-${message}`);
    };
    ask();

    socket.on('data', async (data) => {
      // log an empty line
      console.log();

      // move cursor 1 line up
      await moveCursor(0, -1);

      //clear line
      await clearLine(0);
      console.log(data.toString('utf-8'));
      if (data.toString('utf-8').substring(0, 2) === 'id') {
        // when we are getting the id
        // everything from the third characte until the end
        id = data.toString('utf-8').substring(3);

        console.log(`Your id is ${id}!\n`);
      } else {
        //When we are getting a message
        //
      }

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
