const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');
const { initWebSocket } = require('./websocket');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes'); // Import patient routes

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
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes); // Use patient routes
app.get('/health', async (req, res) => {
    try {
        // Simple DynamoDB health check
        const { ScanCommand } = require('./db');
        await db.docClient.send(new ScanCommand({ TableName: 'users', Limit: 1 }));
        res.status(200).json({ status: 'ok', db: 'connected' });
    } catch (err) {
        res.status(500).json({ status: 'error', db: 'disconnected' });
    }
});

server.listen(PORT, () => {
    console.log(`EMR microservice running on port ${PORT}`);
});

module.exports = { app, server };
