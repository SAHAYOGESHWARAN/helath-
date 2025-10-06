import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { BellIcon, ChevronDownIcon, SearchIcon, LogoutIcon } from '../shared/Icons';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const unreadNotifications = 3; // Mock data

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b-2 border-gray-200 shadow-sm z-10">
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
            className="hidden md:block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Search for patients, appointments..."
          />
           <button className="md:hidden p-2 rounded-full hover:bg-gray-100 text-gray-500">
                <SearchIcon className="h-6 w-6" />
            </button>
        </div>
      </div>

      {/* Right side icons and user menu */}
      <div className="flex items-center space-x-4 sm:space-x-5 ml-4">
        {/* Notification Bell */}
        <button className="relative text-gray-500 hover:text-gray-700 focus:outline-none">
          <BellIcon />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white border-2 border-white">
              {unreadNotifications}
            </span>
          )}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative group">
          <button className="flex items-center focus:outline-none transition-transform transform">
            {user?.avatarUrl && <img src={user.avatarUrl} alt="avatar" className="w-9 h-9 rounded-full border-2 border-gray-200 group-hover:border-primary-400 transition-colors" />}
            <div className="ml-3 hidden md:flex flex-col items-start">
              <span className="text-sm font-semibold text-gray-800">{user?.name}</span>
              <span className="text-xs text-gray-500 capitalize">{user?.role.toLowerCase()}</span>
            </div>
            <ChevronDownIcon className="ml-1 hidden md:block w-5 h-5 text-gray-400" />
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl py-1 hidden group-hover:block ring-1 ring-black ring-opacity-5 focus-within:block animate-fade-in-up origin-top-right">
            <a href="#/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">My Profile</a>
            <a href="#/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">Settings</a>
            <div className="border-t border-gray-100 my-1"></div>
            <button onClick={logout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700">
                <LogoutIcon/>
                <span className="ml-2">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;