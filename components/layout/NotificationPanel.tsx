
import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { BellIcon, CheckCircleIcon } from '../shared/Icons';
import { Link } from 'react-router-dom';

interface NotificationPanelProps {
    onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
    const { notifications, markAsRead, clearAll } = useNotifications();
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const timeSince = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "m ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return "Just now";
    };

    const handleNotificationClick = (id: string) => {
        markAsRead(id);
        onClose();
    };

    return (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-lg shadow-2xl animate-fade-in origin-top-right z-30">
            <div className="flex justify-between items-center p-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                {unreadCount > 0 && <span className="text-xs font-bold text-white bg-primary-600 px-2 py-0.5 rounded-full">{unreadCount} New</span>}
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(n => (
                        <Link to={n.link || '#'} key={n.id} onClick={() => handleNotificationClick(n.id)} className={`flex items-start p-3 hover:bg-gray-50 border-b border-gray-100 ${!n.isRead ? 'bg-primary-50' : ''}`}>
                            {!n.isRead && <div className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>}
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                                <p className="text-xs text-gray-600">{n.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{timeSince(n.timestamp)}</p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="text-center p-8 text-gray-500">
                        <BellIcon className="w-12 h-12 mx-auto mb-2 text-gray-300"/>
                        <p className="text-sm">You're all caught up!</p>
                    </div>
                )}
            </div>
             <div className="flex justify-between items-center p-2 bg-white rounded-b-lg border-t">
                <button onClick={clearAll} className="text-xs font-medium text-red-600 hover:underline">Clear All</button>
                <button onClick={() => notifications.forEach(n => !n.isRead && markAsRead(n.id))} className="text-xs font-medium text-primary-600 hover:underline">Mark all as read</button>
            </div>
        </div>
    );
};

export default NotificationPanel;