"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationProvider = exports.NotificationContext = void 0;
var react_1 = require("react");
var types_1 = require("../types");
var useAuth_1 = require("../hooks/useAuth");
exports.NotificationContext = (0, react_1.createContext)(undefined);
var PATIENT_PROVIDER_MOCK_NOTIFICATIONS = [
    { id: '1', type: 'Lab Result', title: 'New Lab Results', message: 'Your recent lipid panel results are now available.', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), isRead: false, link: '#/records' },
    { id: '2', type: 'Message', title: 'Message from Dr. Smith', message: 'Just a reminder to take your medication as prescribed.', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), isRead: false, link: '#/messaging' },
    { id: '3', type: 'Appointment', title: 'Appointment Confirmed', message: 'Your annual check-up with Dr. Smith is confirmed.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), isRead: true, link: '#/appointments' },
];
var ADMIN_MOCK_NOTIFICATIONS = [
    { id: 'admin1', type: 'System', title: 'New Provider Application', message: 'Dr. Evelyn Reed has applied to join the network.', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), isRead: false, link: '#/users' },
    { id: 'admin2', type: 'Billing', title: 'Subscription Tier Change', message: 'Practice "Cardiology Associates" has upgraded to the Enterprise plan.', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), isRead: false, link: '#/subscriptions' },
    { id: 'admin3', type: 'System', title: 'System Performance Alert', message: 'API response times are higher than normal. Average 150ms.', timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(), isRead: true, link: '#/reports' },
    { id: 'admin4', type: 'System', title: 'Compliance Audit', message: 'A new compliance report is ready for your review.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), isRead: true, link: '#/compliance' },
];
var NotificationProvider = function (_a) {
    var children = _a.children;
    var user = (0, useAuth_1.useAuth)().user;
    var _b = (0, react_1.useState)([]), notifications = _b[0], setNotifications = _b[1];
    (0, react_1.useEffect)(function () {
        if ((user === null || user === void 0 ? void 0 : user.role) === types_1.UserRole.ADMIN) {
            setNotifications(ADMIN_MOCK_NOTIFICATIONS);
        }
        else if (user) {
            setNotifications(PATIENT_PROVIDER_MOCK_NOTIFICATIONS);
        }
        else {
            setNotifications([]);
        }
    }, [user]);
    var addNotification = (0, react_1.useCallback)(function (notification) {
        var newNotification = __assign(__assign({}, notification), { id: "notif_".concat(Date.now()), timestamp: new Date().toISOString(), isRead: false });
        setNotifications(function (prev) { return __spreadArray([newNotification], prev, true); });
    }, []);
    var markAsRead = (0, react_1.useCallback)(function (id) {
        setNotifications(function (prev) { return prev.map(function (n) { return n.id === id ? __assign(__assign({}, n), { isRead: true }) : n; }); });
    }, []);
    var markAllAsRead = (0, react_1.useCallback)(function () {
        setNotifications(function (prev) { return prev.map(function (n) { return (n.isRead ? n : __assign(__assign({}, n), { isRead: true })); }); });
    }, []);
    var clearAll = (0, react_1.useCallback)(function () {
        setNotifications([]);
    }, []);
    var removeNotification = (0, react_1.useCallback)(function (id) {
        setNotifications(function (prev) { return prev.filter(function (n) { return n.id !== id; }); });
    }, []);
    return (<exports.NotificationContext.Provider value={{ notifications: notifications, addNotification: addNotification, markAsRead: markAsRead, markAllAsRead: markAllAsRead, clearAll: clearAll, removeNotification: removeNotification }}>
            {children}
        </exports.NotificationContext.Provider>);
};
exports.NotificationProvider = NotificationProvider;
