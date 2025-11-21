
import React from 'react';
// FIX: Use `react-router-dom` for web-specific components.
import { NavLink } from 'react-router-dom';
import { NovoPathIcon, ArrowRightOnRectangleIcon as LogoutIcon } from '@/components/shared/Icons';
import { useAuth } from '@/contexts/AuthContext';

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
    const rolePath = user!.role.toLowerCase();

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col z-10">
      <div className="h-20 flex items-center justify-center px-6 border-b border-gray-200">
         <div className="flex items-center space-x-3">
          <NovoPathIcon className="w-9 h-9 text-primary-500"/>
          <h1 className="text-xl font-bold text-gray-800 tracking-wider">NovoPath Medical Inc</h1>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={`/${rolePath}/${item.href}`}
            end={item.href === 'dashboard' || item.href === ''}
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 group text-sm font-medium ${
                isActive
                  ? 'bg-primary-100 text-primary-600 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-primary-600'
              }`
            }
          >
            {React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-5 h-5 mr-3 flex-shrink-0" })}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
            <img src={user?.avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full" />
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
            </div>
             <button 
                onClick={logout} 
                className="p-2 text-gray-500 rounded-md hover:bg-gray-200 hover:text-red-500 transition-colors duration-200"
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