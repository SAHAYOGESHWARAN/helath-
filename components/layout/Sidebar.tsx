
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
    const { user, logout } = useAuth();
  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col z-10">
      <div className="h-20 flex items-center justify-center px-6 border-b border-gray-200">
         <div className="flex items-center space-x-3">
          <TangerineIcon className="w-9 h-9 text-tangerine"/>
          <h1 className="text-2xl font-bold text-gray-800 tracking-wider">Tangerine</h1>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 group text-sm font-medium relative ${
                isActive
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
             {({ isActive }) => (
                <>
                    {isActive && <div className="absolute left-0 top-1 bottom-1 w-1 bg-primary-600 rounded-r-full"></div>}
                    <span className="mr-4">{React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-6 h-6" })}</span>
                    <span>{item.name}</span>
                </>
             )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-2 rounded-lg">
            <img src={user?.avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full" />
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
            </div>
             <button 
                onClick={logout} 
                className="p-2 text-gray-500 rounded-md hover:bg-red-100 hover:text-red-600 transition-colors duration-200 group flex-shrink-0"
                title="Logout"
              >
                  <LogoutIcon className="w-5 h-5" />
              </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;