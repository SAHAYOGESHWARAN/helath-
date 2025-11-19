/* eslint-disable react-refresh/only-export-components */
import React, { ReactNode, useCallback } from 'react';
import { useNotifications } from './NotificationContext';

export interface ToastMessage {
  id: number | string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const useApp = () => {
  const { addNotification } = useNotifications();

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    addNotification({
      title: type.charAt(0).toUpperCase() + type.slice(1),
      message,
      type,
      timestamp: new Date().toISOString(),
      isRead: false,
    });
  }, [addNotification]);

  return {
    showToast,
  };
};

