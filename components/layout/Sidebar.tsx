import React from 'react';
import { NavLink } from 'react-router-dom';
import { TangerineIcon, LogoutIcon } from '../shared/Icons';
import { useAuth } from '../../hooks/useAuth';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  navItems: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ navItems }) => {
    const { logout } = useAuth();
  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r-2 border-gray-200 flex flex-col">
      <div className="h-20 flex items-center justify-center px-6 border-b-2 border-gray-200">
         <div className="flex items-center space-x-3">
          <TangerineIcon />
          <h1 className="text-2xl font-bold text-gray-800">Tangerine</h1>
        </div>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-gray-700 rounded-md transition-colors duration-200 ${
                isActive
                  ? 'bg-primary-100 text-primary-700 font-semibold'
                  : 'hover:bg-gray-100'
              }`
            }
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-4 border-t-2 border-gray-200">
          <button onClick={logout} className="flex items-center w-full px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100">
              <LogoutIcon />
              <span className="ml-3">Logout</span>
          </button>
      </div>
    </aside>
  );
};

export default Sidebar;
