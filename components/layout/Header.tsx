import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { BellIcon, ChevronDownIcon } from '../shared/Icons';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b-2 border-gray-200">
      <div className="flex items-center">
        {/* Placeholder for search bar or other header elements */}
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
          <BellIcon />
        </button>
        <div className="relative group">
          <button className="flex items-center focus:outline-none">
            {user?.avatarUrl && <img src={user.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full" />}
            <span className="ml-2 hidden md:inline">{user?.name}</span>
            <ChevronDownIcon />
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block focus-within:block">
            <a href="#/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
            <button onClick={logout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
