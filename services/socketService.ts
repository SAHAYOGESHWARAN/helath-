const DEFAULT_SOCKET_URL = 'ws://localhost:8080';

import { eventBus, EVENTS } from './eventBus';

type MessageCallback = (data: any) => void;
type Status = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

class SocketService {
  private client: WebSocket | null = null;
  private url: string = DEFAULT_SOCKET_URL;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectTimer: any = null;
  private callbacks: MessageCallback[] = [];
  private statusCallbacks: ((s: Status) => void)[] = [];
  private status: Status = 'disconnected';
  private sendQueue: string[] = [];

  /**
   * Connect to the websocket server.
   * @param id A contextual id (userId/encounterId/tenantId) appended as a query param
   * @param options.optional token for auth (will be sent as protocol and as query param fallback)
   */
  connect(id: string, options?: { token?: string; url?: string }) {
    if (options?.url) this.url = options.url;

    if (this.client && this.client.readyState === WebSocket.OPEN) return;

    this.setStatus('connecting');

    // Build url with query params
    const params = new URLSearchParams({ id });
    if (options?.token) params.set('token', options.token);
    const connectUrl = `${this.url}?${params.toString()}`;

    // If token present, also pass it as a subprotocol (many servers accept this)
    const protocols = options?.token ? [`Bearer ${options.token}`] : undefined;

    try {
      this.client = new WebSocket(connectUrl, protocols as string[] | undefined);
    } catch (err) {
      console.error('WebSocket constructor failed', err);
      this.scheduleReconnect(id, options);
      return;
    }

    this.client.onopen = () => {
      console.debug('WebSocket connected', connectUrl);
      this.reconnectAttempts = 0;
      this.setStatus('connected');
      // flush queue
      while (this.sendQueue.length > 0 && this.client && this.client.readyState === WebSocket.OPEN) {
        const msg = this.sendQueue.shift()!;
        this.client.send(msg);
      }
    };

    this.client.onmessage = (message) => {
      let data: any = message.data;
      try {
        if (typeof message.data === 'string') data = JSON.parse(message.data);
      } catch (err) {
        // ignore parse errors and pass raw payload
      }
      // Forward socket events into the local event bus so all listeners react consistently.
      try {
        if (data && data.type) {
          eventBus.publish(data.type, data.payload);
        }
      } catch (e) {
        console.error('Failed to publish socket event to eventBus', e);
      }
      this.callbacks.forEach(cb => {
        try { cb(data); } catch (e) { console.error('socket callback error', e); }
      });
    };

    this.client.onclose = (ev) => {
      console.warn('WebSocket closed', ev.code, ev.reason);
      this.client = null;
      this.setStatus('disconnected');
      this.scheduleReconnect(id, options);
    };

    this.client.onerror = (err) => {
      console.error('WebSocket error', err);
      // close will trigger reconnect logic
    };
  }

  private scheduleReconnect(id: string, options?: { token?: string; url?: string }) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max WebSocket reconnect attempts reached');
      return;
    }
    this.reconnectAttempts += 1;
    this.setStatus('reconnecting');
    const backoff = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 30000);
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.connect(id, options);
    }, backoff);
    console.debug(`Scheduling WebSocket reconnect #${this.reconnectAttempts} in ${backoff}ms`);
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.client) {
      try { this.client.close(); } catch (e) { /* ignore */ }
      this.client = null;
    }
    this.callbacks = [];
    this.sendQueue = [];
  }

  sendMessage(message: object) {
    const payload = JSON.stringify(message);
    if (this.client && this.client.readyState === WebSocket.OPEN) {
      this.client.send(payload);
      return;
    }
    // queue until connected
    this.sendQueue.push(payload);
  }

  onMessage(callback: MessageCallback) {
    if (!this.callbacks.includes(callback)) this.callbacks.push(callback);
    // return an unsubscribe function
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  onStatusChange(cb: (s: Status) => void) {
    if (!this.statusCallbacks.includes(cb)) this.statusCallbacks.push(cb);
    // immediately notify current status
    try { cb(this.status); } catch (e) { /* ignore */ }
    return () => { this.statusCallbacks = this.statusCallbacks.filter(c => c !== cb); };
  }

  private setStatus(s: Status) {
    this.status = s;
    this.statusCallbacks.forEach(cb => {
      try { cb(s); } catch (e) { console.error('status callback error', e); }
    });
  }
}

export const socketService = new SocketService();