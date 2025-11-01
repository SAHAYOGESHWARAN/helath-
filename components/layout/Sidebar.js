"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
// FIX: Replaced LogoutIcon with ArrowRightOnRectangleIcon and aliased it as LogoutIcon
var Icons_1 = require("../shared/Icons");
var useAuth_1 = require("../../hooks/useAuth");
var Sidebar = function (_a) {
    var _b;
    var navItems = _a.navItems;
    var _c = (0, useAuth_1.useAuth)(), user = _c.user, logout = _c.logout;
    return (<aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col z-10">
      <div className="h-20 flex items-center justify-center px-6 border-b border-gray-200">
         <div className="flex items-center space-x-3">
          <Icons_1.NovoPathIcon className="w-9 h-9 text-accent"/>
          <h1 className="text-2xl font-bold text-gray-800 tracking-wider">NovoPath</h1>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map(function (item) { return (<react_router_dom_1.NavLink key={item.name} to={item.href} end={item.href === '/dashboard'} className={function (_a) {
                var isActive = _a.isActive;
                return "flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 group text-sm font-medium relative ".concat(isActive
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900');
            }}>
             {function (_a) {
                var isActive = _a.isActive;
                return (<>
                    {isActive && <div className="absolute left-0 top-1 bottom-1 w-1 bg-primary-600 rounded-r-full"></div>}
                    <span className="mr-4">{react_1.default.cloneElement(item.icon, { className: "w-6 h-6" })}</span>
                    <span>{item.name}</span>
                </>);
            }}
          </react_router_dom_1.NavLink>); })}
      </nav>

      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-2 rounded-lg">
            <img src={user === null || user === void 0 ? void 0 : user.avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full"/>
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-gray-800 truncate">{user === null || user === void 0 ? void 0 : user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{(_b = user === null || user === void 0 ? void 0 : user.role) === null || _b === void 0 ? void 0 : _b.toLowerCase()}</p>
            </div>
             <button onClick={logout} className="p-2 text-gray-500 rounded-md hover:bg-red-100 hover:text-red-600 transition-colors duration-200 group flex-shrink-0" title="Logout">
                  <Icons_1.ArrowRightOnRectangleIcon className="w-5 h-5"/>
              </button>
        </div>
      </div>
    </aside>);
};
exports.default = Sidebar;
