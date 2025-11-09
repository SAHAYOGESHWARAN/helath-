const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

app.get('/api/emr', (req, res) => {
  res.json({ message: 'EMR data' });
});

const PORT = process.env.EMR_PORT || 4001;
server.listen(PORT, () => console.log(`EMR microservice listening on port ${PORT}`));
