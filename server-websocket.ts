import express from 'express';
import cors from 'cors';
import WebSocket from 'ws';
import { IncomingMessage } from 'http';

const PORT: number = parseInt(process.env.WEBSOCKET_PORT || '4001', 10);

interface WebSocketMessage {
  type: string;
  data?: any;
}

function createWebSocketServer(): WebSocketServer {
  const wss = new WebSocketServer({ noServer: true });

  wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
    console.log('WebSocket connection established');

    ws.on('message', (message: WebSocket.RawData) => {
      try {
        const parsedMessage: WebSocketMessage = JSON.parse(message.toString());
        console.log('Received message:', parsedMessage);

        // Echo the message back for now
        ws.send(JSON.stringify({ type: 'echo', data: parsedMessage }));
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
        ws.send(JSON.stringify({ type: 'error', data: 'Invalid message format' }));
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });

    ws.on('error', (err: Error) => {
      console.error('WebSocket error:', err);
    });
  });

  return wss;
}

async function main(): Promise<void> {
  const app = express();
  app.use(cors({ origin: true }));
  app.use(express.json());

  const wss = createWebSocketServer();

  app.get('/health', (req: express.Request, res: express.Response) => {
    res.json({ status: 'WebSocket server is running' });
  });

  const server = app.listen(PORT, () => {
    console.log(`WebSocket server listening on port ${PORT}`);
  });

  server.on('upgrade', (request: IncomingMessage, socket: any, head: Buffer) => {
    wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
      wss.emit('connection', ws, request);
    });
  });

  // Keep the process alive and log unhandled errors for easier debugging in dev
  process.on('uncaughtException', (err: Error) => {
    console.error('Uncaught exception in WebSocket server:', err);
    // don't exit in dev
  });

  process.on('unhandledRejection', (reason: unknown, p: Promise<unknown>) => {
    console.error('Unhandled Rejection at Promise', p, 'reason:', reason);
    // don't exit in dev
  });
}

main().catch(err => {
  console.error('Fatal error starting WebSocket server', err);
  process.exit(1);
});
