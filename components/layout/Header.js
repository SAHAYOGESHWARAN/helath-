"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useAuth_1 = require("../../hooks/useAuth");
// FIX: Replaced LogoutIcon with ArrowRightOnRectangleIcon and aliased it as LogoutIcon
var Icons_1 = require("../shared/Icons");
var useNotifications_1 = require("../../hooks/useNotifications");
var NotificationPanel_1 = require("./NotificationPanel");
var Header = function () {
    var _a = (0, useAuth_1.useAuth)(), user = _a.user, logout = _a.logout;
    var notifications = (0, useNotifications_1.useNotifications)().notifications;
    var _b = (0, react_1.useState)(false), isNotificationsOpen = _b[0], setIsNotificationsOpen = _b[1];
    var unreadCount = notifications.filter(function (n) { return !n.isRead; }).length;
    return (<>
    <header className="relative flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b border-gray-200 z-20">
      {/* Global Search Bar */}
      <div className="flex-1 flex justify-start">
        <div className="relative w-full max-w-xs lg:max-w-md">
           {/* Desktop Search */}
           <div className="relative hidden md:block">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icons_1.SearchIcon className="h-5 w-5 text-gray-400"/>
            </div>
            <input type="search" name="search" id="search" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="Search..."/>
           </div>
           {/* Mobile Search Icon */}
           <button className="md:hidden p-2 rounded-full hover:bg-gray-100 text-gray-500">
                <Icons_1.SearchIcon className="h-6 w-6"/>
            </button>
        </div>
      </div>

      {/* Right side icons and user menu */}
      <div className="flex items-center space-x-4 sm:space-x-5 ml-4">
        {/* Notification Bell */}
        <div className="relative">
          <button onClick={function () { return setIsNotificationsOpen(function (prev) { return !prev; }); }} className="relative text-gray-500 hover:text-primary-600 focus:outline-none transition-colors">
            <Icons_1.BellIcon className="w-6 h-6"/>
            {unreadCount > 0 && (<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white font-bold animate-pulse-badge">
                {unreadCount}
              </span>)}
          </button>
          {isNotificationsOpen && <NotificationPanel_1.default onClose={function () { return setIsNotificationsOpen(false); }}/>}
        </div>


        {/* User Profile Dropdown */}
        <div className="relative group">
          <button className="flex items-center focus:outline-none transition-transform transform">
            {(user === null || user === void 0 ? void 0 : user.avatarUrl) && <img src={user.avatarUrl} alt="avatar" className="w-9 h-9 rounded-full border-2 border-gray-300 group-hover:border-primary-500 transition-colors"/>}
            <div className="ml-3 hidden md:flex items-baseline space-x-2">
              <span className="text-sm font-semibold text-gray-800">{user === null || user === void 0 ? void 0 : user.name}</span>
              {(user === null || user === void 0 ? void 0 : user.role) && <span className="text-xs text-gray-500 capitalize">({user.role.toLowerCase()})</span>}
            </div>
            <Icons_1.ChevronDownIcon className="ml-1 hidden md:block w-5 h-5 text-gray-400"/>
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 hidden group-hover:block animate-fade-in origin-top-right z-10">
            <a href="#/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Icons_1.UserCircleIcon className="w-5 h-5 mr-3 text-gray-400"/>
                <span>My Profile</span>
            </a>
            <a href="#/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Icons_1.CogIcon className="w-5 h-5 mr-3 text-gray-400"/>
                <span>Settings</span>
            </a>
            <div className="border-t border-gray-100 my-1"></div>
            <button onClick={logout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600">
                <Icons_1.ArrowRightOnRectangleIcon className="w-5 h-5 mr-3"/>
                <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
    </>);
};
exports.default = Header;
