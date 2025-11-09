
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { socketService } from '@/services/socketService';
import { useAuth } from './AuthContext';

type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

interface WebSocketContextType {
  status: WebSocketStatus;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [status, setStatus] = useState<WebSocketStatus>('disconnected');

  useEffect(() => {
    if (user?.id) {
      socketService.connect(user.id);
      const unsubscribe = socketService.onStatusChange(setStatus);
      return () => {
        unsubscribe();
        socketService.disconnect();
      };
    }
  }, [user]);

  return (
    <WebSocketContext.Provider value={{ status }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
