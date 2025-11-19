/* eslint-disable react-refresh/only-export-components */
import React, { ReactNode, createContext } from 'react';
import { useNotificationStore } from '@/stores/notificationStore';

interface NotificationContextType {
  notifications: any[];
  addNotification: (notification: any) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const { notifications, addNotification, removeNotification } = useNotificationStore();

  const markAsRead = (id: string) => {
    // This is a mock implementation. In a real app, you would call an API.
    useNotificationStore.setState(prev => ({
        notifications: prev.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
    }));
  };

  const markAllAsRead = () => {
    // This is a mock implementation. In a real app, you would call an API.
    useNotificationStore.setState(prev => ({
        notifications: prev.notifications.map(n => (n.isRead ? n : { ...n, isRead: true }))
    }));
  };

  const clearAll = () => {
    useNotificationStore.setState({ notifications: [] });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
  };
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value = useNotifications();
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
