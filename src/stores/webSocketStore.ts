import { create } from 'zustand';

interface WebSocketState {
  socket: WebSocket | null;
  isConnected: boolean;
  lastMessage: any;
  error: any;
  connect: (url: string) => void;
  disconnect: () => void;
  sendMessage: (message: any) => void;
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  lastMessage: null,
  error: null,
  connect: (url) => {
    const socket = new WebSocket(url);
    socket.onopen = () => set({ isConnected: true });
    socket.onclose = () => set({ isConnected: false });
    socket.onerror = (error) => set({ error });
    socket.onmessage = (event) => set({ lastMessage: event.data });
    set({ socket });
  },
  disconnect: () => {
    get().socket?.close();
    set({ socket: null, isConnected: false });
  },
  sendMessage: (message) => {
    get().socket?.send(message);
  },
}));
