import React, { createContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Notification, UserRole } from '../types';
import { useAuth } from '../hooks/useAuth';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const PATIENT_PROVIDER_MOCK_NOTIFICATIONS: Notification[] = [
    { id: '1', type: 'Lab Result', title: 'New Lab Results', message: 'Your recent lipid panel results are now available.', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), isRead: false, link: '#/records' },
    { id: '2', type: 'Message', title: 'Message from Dr. Smith', message: 'Just a reminder to take your medication as prescribed.', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), isRead: false, link: '#/messaging' },
    { id: '3', type: 'Appointment', title: 'Appointment Confirmed', message: 'Your annual check-up with Dr. Smith is confirmed.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), isRead: true, link: '#/appointments' },
];

const ADMIN_MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'admin1', type: 'System', title: 'New Provider Application', message: 'Dr. Evelyn Reed has applied to join the network.', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), isRead: false, link: '#/users' },
    { id: 'admin2', type: 'Billing', title: 'Subscription Tier Change', message: 'Practice "Cardiology Associates" has upgraded to the Enterprise plan.', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), isRead: false, link: '#/subscriptions' },
    { id: 'admin3', type: 'System', title: 'System Performance Alert', message: 'API response times are higher than normal. Average 150ms.', timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(), isRead: true, link: '#/reports' },
    { id: 'admin4', type: 'System', title: 'Compliance Audit', message: 'A new compliance report is ready for your review.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), isRead: true, link: '#/compliance' },
];


export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (user?.role === UserRole.ADMIN) {
            setNotifications(ADMIN_MOCK_NOTIFICATIONS);
        } else if (user) {
            setNotifications(PATIENT_PROVIDER_MOCK_NOTIFICATIONS);
        } else {
            setNotifications([]);
        }
    }, [user]);

    const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
        const newNotification: Notification = {
            ...notification,
            id: `notif_${Date.now()}`,
            timestamp: new Date().toISOString(),
            isRead: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, []);

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, clearAll }}>
            {children}
        </NotificationContext.Provider>
    );
};