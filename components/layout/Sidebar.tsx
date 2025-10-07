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
    // Modern dark theme for the main sidebar container
    <aside className="w-64 flex-shrink-0 bg-gray-800 flex flex-col shadow-lg">
      <div className="h-20 flex items-center justify-center px-6 border-b border-gray-700">
         <div className="flex items-center space-x-3">
          <TangerineIcon className="w-8 h-8 text-white"/>
          <h1 className="text-2xl font-bold text-white tracking-wider">Tangerine</h1>
        </div>
      </div>
      {/* Navigation section with consistent spacing */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/dashboard'}
            // Consistent styling for links with clear active and hover states
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-md transition-colors duration-200 group border-l-4 ${
                isActive
                  ? 'bg-gray-900/50 text-white border-tangerine' // Highlighted active link
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white border-transparent' // Subtle hover effect
              }`
            }
          >
             {/* FIX: Cast item.icon to allow passing className prop */}
             <span className="mr-3">{React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-6 h-6" })}</span>
             <span className="font-medium text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      {/* Footer section for logout, styled consistently */}
      <div className="px-4 py-4 border-t border-gray-700">
          <button 
            onClick={logout} 
            className="flex items-center w-full px-3 py-2.5 text-gray-400 rounded-md hover:bg-gray-700/50 hover:text-red-400 transition-colors duration-200 group"
          >
              <LogoutIcon className="w-6 h-6 text-gray-400 transition-colors group-hover:text-red-400" />
              <span className="ml-3 font-medium text-sm">Logout</span>
          </button>
      </div>
    </aside>
  );
};

export default Sidebar;