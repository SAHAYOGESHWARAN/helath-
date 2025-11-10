const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/notes';
const PORT = process.env.NOTES_PORT || 4003;
const API_KEY = process.env.API_KEY;

let db;

MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db();
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const broadcast = (data) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

wss.on('connection', ws => {
  console.log('Client connected to WebSocket');
  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
  });
});

const checkApiKey = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header with Bearer token is required' });
  }

  const apiKey = authHeader.split(' ')[1];
  if (apiKey !== API_KEY) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  next();
};

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api', checkApiKey);

app.get('/api/notes', async (req, res) => {
    try {
        const notes = await db.collection('notes').find({}).toArray();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/notes', async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Request body cannot be empty.' });
  }
  try {
    const newNote = req.body;
    const result = await db.collection('notes').insertOne(newNote);
    const createdNote = Object.assign({_id: result.insertedId}, newNote);

    broadcast({
      type: 'NOTE_CREATED',
      payload: createdNote
    });

    res.status(201).json(createdNote);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create note', details: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`Notes microservice running on port ${PORT}`);
});

module.exports = { app, server, db };
