"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNotifications = void 0;
var react_1 = require("react");
var NotificationContext_1 = require("../contexts/NotificationContext");
var useNotifications = function () {
    var context = (0, react_1.useContext)(NotificationContext_1.NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
exports.useNotifications = useNotifications;
