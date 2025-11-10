const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/emr';
const PORT = process.env.EMR_PORT || 4001;
const API_KEY = process.env.API_KEY;

let db;

// Connect to MongoDB
MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db();
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  console.log('Client connected to WebSocket');

  ws.on('message', message => {
    console.log('received: %s', message);
  });

  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
  });
});

// Function to broadcast data to all connected clients
const broadcast = (data) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

wss.on('connection', ws => {
  console.log('Client connected to WebSocket');

  ws.on('message', message => {
    console.log('received: %s', message);
  });

  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
  });
});

// Auth middleware
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

// API endpoints
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// All other API routes should be protected
app.use('/api', checkApiKey);

// Get all patient records
app.get('/api/patients', async (req, res) => {
    try {
        const records = await db.collection('records').find({}).toArray();
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single patient record by ID
app.get('/api/patients/:patientId', async (req, res) => {
    try {
        const { patientId } = req.params;
        // In a real scenario, you would query by a proper patient ID.
        // Here we assume the 'id' field on the document matches.
        const record = await db.collection('records').findOne({ id: patientId });
        if (record) {
            res.json(record);
        } else {
            res.status(404).json({ error: 'Patient not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Create a new record and broadcast it
app.post('/api/patients', async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Request body cannot be empty.' });
  }
  try {
    const newRecord = req.body;
    const result = await db.collection('records').insertOne(newRecord);
    const createdRecord = Object.assign({_id: result.insertedId}, newRecord);

    // Broadcast the newly created record to all connected WebSocket clients
    broadcast({
      type: 'RECORD_CREATED',
      payload: createdRecord
    });

    res.status(201).json(createdRecord);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create record', details: err.message });
  }
});


server.listen(PORT, () => {
  console.log(`EMR microservice running on port ${PORT}`);
});

module.exports = { app, server, db };
