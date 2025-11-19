/* eslint-disable react-refresh/only-export-components */
import { useEffect } from 'react';
import { socketService } from '@/services/socketService';
import { useAuthStore } from '@/stores/authStore';
import { useWebSocketStore } from '@/stores/webSocketStore';

export const WebSocketController: React.FC = () => {
  const { user } = useAuthStore();
  const { connect, disconnect } = useWebSocketStore();

  useEffect(() => {
    if (user?.id) {
      const url = `ws://localhost:4001?userId=${user.id}`;
      connect(url);
      
      return () => {
        disconnect();
      };
    }
  }, [user, connect, disconnect]);

  return null;
};