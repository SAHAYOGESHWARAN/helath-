const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./db/mongo');
const { initWebSocket } = require('./websocket');
const patientRoutes = require('./routes/patientRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.EMR_PORT || 4001;
const API_KEY = process.env.API_KEY;

// Connect to MongoDB
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server
const wss = initWebSocket(server);
app.set('wss', wss);

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

app.use('/api/patients', checkApiKey, patientRoutes);

server.listen(PORT, () => {
    console.log(`EMR microservice running on port ${PORT}`);
});

module.exports = { app, server };
