import { WebSocketServer, WebSocket } from 'ws';
import { URL } from 'url';

const PORT: number = parseInt(process.env.WEBSOCKET_PORT || '8080', 10);

const wss = new WebSocketServer({ port: PORT });

const clients = new Map<string, WebSocket>();

console.log(`WebSocket server running on port ${PORT}`);

wss.on('connection', (ws: WebSocket, req: { url?: string }) => {
    const urlObj = new URL(req.url || '', 'http://localhost');
    const id = urlObj.searchParams.get('id');
    const token = urlObj.searchParams.get('token');

    if (!id || !token || !token.startsWith('demo-jwt-')) {
        console.warn('Connection attempt without valid ID or token. Closing.');
        ws.close();
        return;
    }

    clients.set(id, ws);
    console.log(`Client connected: ${id}`);

    ws.on('message', (message: WebSocket.RawData) => {
        let parsedMessage;
        try {
            parsedMessage = JSON.parse(message.toString());
        } catch {
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

    ws.on('error', (error: Error) => {
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
