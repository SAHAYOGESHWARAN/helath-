const WebSocket = require('ws');

let wss;

const initWebSocket = (server) => {
    wss = new WebSocket.Server({ server });

    wss.on('connection', ws => {
        console.log('Client connected to WebSocket');

        ws.on('message', message => {
            console.log('received: %s', message);
        });

        ws.on('close', () => {
            console.log('Client disconnected from WebSocket');
        });
    });

    wss.broadcast = (data) => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    };

    return wss;
};

const getWss = () => wss;

module.exports = { initWebSocket, getWss };
