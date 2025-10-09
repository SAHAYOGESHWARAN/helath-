import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { BellIcon, ChevronDownIcon, SearchIcon, LogoutIcon, ProfileIcon, CogIcon } from '../shared/Icons';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationPanel from './NotificationPanel';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="relative flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b border-gray-200 z-20">
      {/* Global Search Bar */}
      <div className="flex-1 flex justify-start">
        <div className="relative w-full max-w-xs lg:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            name="search"
            id="search"
            className="hidden md:block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Search..."
          />
           <button className="md:hidden p-2 rounded-full hover:bg-gray-100 text-gray-500">
                <SearchIcon className="h-6 w-6" />
            </button>
        </div>
      </div>

      {/* Right side icons and user menu */}
      <div className="flex items-center space-x-4 sm:space-x-5 ml-4">
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(prev => !prev)}
            className="relative text-gray-500 hover:text-primary-600 focus:outline-none transition-colors"
          >
            <BellIcon className="w-6 h-6"/>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white font-bold">
                {unreadCount}
              </span>
            )}
          </button>
          {isNotificationsOpen && <NotificationPanel onClose={() => setIsNotificationsOpen(false)} />}
        </div>


        {/* User Profile Dropdown */}
        <div className="relative group">
          <button className="flex items-center focus:outline-none transition-transform transform">
            {user?.avatarUrl && <img src={user.avatarUrl} alt="avatar" className="w-9 h-9 rounded-full border-2 border-gray-300 group-hover:border-primary-500 transition-colors" />}
            <div className="ml-3 hidden md:flex items-baseline space-x-2">
              <span className="text-sm font-semibold text-gray-800">{user?.name}</span>
              {user?.role && <span className="text-xs text-gray-500 capitalize">({user.role.toLowerCase()})</span>}
            </div>
            <ChevronDownIcon className="ml-1 hidden md:block w-5 h-5 text-gray-400" />
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 hidden group-hover:block animate-fade-in origin-top-right z-10">
            <a href="#/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <ProfileIcon className="w-5 h-5 mr-3 text-gray-400"/>
                <span>My Profile</span>
            </a>
            <a href="#/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <CogIcon className="w-5 h-5 mr-3 text-gray-400"/>
                <span>Settings</span>
            </a>
            <div className="border-t border-gray-100 my-1"></div>
            <button onClick={logout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600">
                <LogoutIcon className="w-5 h-5 mr-3"/>
                <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;