/* eslint-env node */
/* global process, console, setInterval */
import http from 'http';
import url from 'url';
import websocket from 'websocket';

const PORT = process.env.MOCK_WS_PORT || 8080;

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Mock WebSocket server for local testing');
});

server.listen(PORT, () => {
  console.log(`Mock WebSocket server listening on port ${PORT}`);
});

const wsServer = new websocket.server({
  httpServer: server,
  autoAcceptConnections: false,
});

const connections = new Set();

function originIsAllowed() {
  // Allow all origins in local dev
  return true;
}

wsServer.on('request', (request) => {
  if (!originIsAllowed(request.origin)) {
    request.reject();
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    return;
  }

  const parsed = url.parse(request.resource || '', true);
  const id = parsed.query.id || 'unknown';
  const token = parsed.query.token || null;

  const connection = request.accept(null, request.origin);
  connection.id = id;
  connection.token = token;
  connections.add(connection);

  console.log(`Connection accepted: id=${id} token=${token ? 'present' : 'none'}`);

  connection.on('message', (message) => {
    if (message.type === 'utf8') {
      try {
        const data = JSON.parse(message.utf8Data);
        console.log('Received message from client:', data);
        // Echo back a confirmation
        connection.sendUTF(JSON.stringify({ type: 'ack', payload: data }));
      } catch (err) {
        // ignore
      }
    }
  });

  connection.on('close', () => {
    connections.delete(connection);
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});

// Broadcast a fake message.created event every 6 seconds
setInterval(() => {
  if (connections.size === 0) return;

  const now = new Date().toISOString();
  connections.forEach((conn) => {
    const msg = {
      id: `msg_${Date.now()}`,
      senderId: conn.id === 'unknown' ? 'provider_1' : `provider_${Math.floor(Math.random()*5)+1}`,
      receiverId: conn.id || 'user_unknown',
      text: `Automated message at ${now}`,
      timestamp: now,
      isRead: false,
    };

    const envelope = { type: 'message.created', payload: msg };
    try {
      conn.sendUTF(JSON.stringify(envelope));
    } catch (err) {
      // ignore send errors
    }
  });
}, 6000);
