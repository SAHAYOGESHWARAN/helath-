"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useNotifications_1 = require("../../hooks/useNotifications");
var Icons_1 = require("../shared/Icons");
var react_router_dom_1 = require("react-router-dom");
var NotificationPanel = function (_a) {
    var onClose = _a.onClose;
    var _b = (0, useNotifications_1.useNotifications)(), notifications = _b.notifications, markAsRead = _b.markAsRead, clearAll = _b.clearAll, removeNotification = _b.removeNotification, markAllAsRead = _b.markAllAsRead;
    var unreadCount = notifications.filter(function (n) { return !n.isRead; }).length;
    var timeSince = function (date) {
        var seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        var interval = seconds / 31536000;
        if (interval > 1)
            return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1)
            return Math.floor(interval) + "m ago";
        interval = seconds / 86400;
        if (interval > 1)
            return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1)
            return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1)
            return Math.floor(interval) + "m ago";
        return "Just now";
    };
    var handleNotificationClick = function (id) {
        markAsRead(id);
        onClose();
    };
    var handleDismiss = function (e, id) {
        e.preventDefault();
        e.stopPropagation();
        removeNotification(id);
    };
    return (<div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-lg shadow-2xl animate-fade-in origin-top-right z-30">
            <div className="flex justify-between items-center p-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                {unreadCount > 0 && <span className="text-xs font-bold text-white bg-primary-600 px-2 py-0.5 rounded-full">{unreadCount} New</span>}
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (notifications.map(function (n) { return (<react_router_dom_1.Link to={n.link || '#'} key={n.id} onClick={function () { return handleNotificationClick(n.id); }} className={"group relative flex items-start p-3 hover:bg-gray-50 border-b border-gray-100 ".concat(!n.isRead ? 'bg-primary-50 animate-pulse-bg-once' : '')}>
                            {!n.isRead && <div className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>}
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                                <p className="text-xs text-gray-600">{n.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{timeSince(n.timestamp)}</p>
                            </div>
                            <button onClick={function (e) { return handleDismiss(e, n.id); }} className="absolute top-2 right-2 p-0.5 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Dismiss notification">
                                <Icons_1.XMarkIcon className="w-3.5 h-3.5"/>
                            </button>
                        </react_router_dom_1.Link>); })) : (<div className="text-center p-8 text-gray-500">
                        <Icons_1.BellIcon className="w-12 h-12 mx-auto mb-2 text-gray-300"/>
                        <p className="text-sm">You're all caught up!</p>
                    </div>)}
            </div>
             <div className="flex justify-between items-center p-2 bg-white rounded-b-lg border-t">
                <button onClick={clearAll} className="text-xs font-medium text-red-600 hover:underline">Clear All</button>
                <button onClick={markAllAsRead} disabled={unreadCount === 0} className="text-xs font-medium text-primary-600 hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed">
                    Mark all as read
                </button>
            </div>
        </div>);
};
exports.default = NotificationPanel;
