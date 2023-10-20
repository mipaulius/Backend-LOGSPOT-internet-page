const net = require('net');

const host = 'lynas.serveriai.lt';
const port = 587;

const client = net.createConnection({ host, port }, () => {
  console.log(`Connected to ${host}:${port}`);
  client.end();
});

client.on('error', (error) => {
  console.error('Error connecting to SMTP server:', error);
});
