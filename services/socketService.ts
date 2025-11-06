import { w3cwebsocket as W3CWebSocket } from 'websocket';

const socketUrl = 'ws://localhost:8080';

class SocketService {
  private client: W3CWebSocket | null = null;

  connect(encounterId: string) {
    if (this.client && this.client.readyState === this.client.OPEN) {
      return;
    }

    this.client = new W3CWebSocket(`${socketUrl}?encounterId=${encounterId}`);

    this.client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
  }

  disconnect() {
    if (this.client) {
      this.client.close();
      this.client = null;
    }
  }

  sendMessage(message: object) {
    if (this.client && this.client.readyState === this.client.OPEN) {
      this.client.send(JSON.stringify(message));
    }
  }

  onMessage(callback: (data: any) => void) {
    if (this.client) {
      this.client.onmessage = (message) => {
        if (typeof message.data === 'string') {
          callback(JSON.parse(message.data));
        }
      };
    }
  }
}

export const socketService = new SocketService();