const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./db/mongo');
const { initWebSocket } = require('./websocket');
const patientRoutes = require('./routes/patientRoutes');
const { checkAuth } = require('./auth');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.EMR_PORT || 4001;

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server
const wss = initWebSocket(server);
app.set('wss', wss);

// API endpoints
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api/patients', checkAuth(['provider', 'admin']), patientRoutes);

server.listen(PORT, () => {
    if (process.env.NODE_ENV !== 'test') {
        connectDB();
    }
    console.log(`EMR microservice running on port ${PORT}`);
});

module.exports = { app, server };
