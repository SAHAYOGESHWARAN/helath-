
/* eslint-env node */
const WebSocket = require('ws');
const url = require('url');

const PORT = process.env.WEBSOCKET_PORT || 8080;

const wss = new WebSocket.Server({ port: PORT });

const clients = new Map();

console.log(`WebSocket server running on port ${PORT}`);

wss.on('connection', (ws, req) => {
    const parameters = new url.URLSearchParams(url.parse(req.url).search);
    const id = parameters.get('id');
    const token = parameters.get('token');

    if (!id || !token || !token.startsWith('demo-jwt-')) {
        console.warn('Connection attempt without valid ID or token. Closing.');
        ws.close();
        return;
    }

    clients.set(id, ws);
    console.log(`Client connected: ${id}`);

    ws.on('message', (message) => {
        let parsedMessage;
        try {
            parsedMessage = JSON.parse(message);
        } catch (error) {
            console.error('Failed to parse message:', message);
            return;
        }

        console.log(`Received message from ${id}:`, parsedMessage);

        const { payload } = parsedMessage;
        const recipientId = payload?.receiverId;

        if (!recipientId) {
            console.warn(`Message from ${id} is missing a receiverId.`);
            return;
        }

        const recipientSocket = clients.get(recipientId);
        if (recipientSocket && recipientSocket.readyState === WebSocket.OPEN) {
            recipientSocket.send(JSON.stringify({ ...parsedMessage, sender: id }));
            console.log(`Sent message from ${id} to ${recipientId}`);
        } else {
            console.warn(`Recipient ${recipientId} not connected or socket not open.`);
            // In a real app, you might queue this message.
        }
    });

    ws.on('close', () => {
        clients.delete(id);
        console.log(`Client disconnected: ${id}`);
    });

    ws.on('error', (error) => {
        console.error(`WebSocket error for client ${id}:`, error);
        clients.delete(id);
    });
});

process.on('SIGINT', () => {
    console.log('Shutting down WebSocket server...');
    wss.close(() => {
        console.log('Server has been shut down.');
        process.exit(0);
    });
});
