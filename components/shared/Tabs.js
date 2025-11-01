"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Tabs = function (_a) {
    var tabs = _a.tabs;
    var _b = (0, react_1.useState)(0), activeTab = _b[0], setActiveTab = _b[1];
    return (<div>
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                    {tabs.map(function (tab, index) { return (<button key={tab.name} onClick={function () { return setActiveTab(index); }} className={"\n                                flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm\n                                transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 rounded-t-sm\n                                ".concat(activeTab === index
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', "\n                            ")} aria-current={activeTab === index ? 'page' : undefined}>
                            {/* FIX: Cast tab.icon to allow passing className */}
                            {react_1.default.cloneElement(tab.icon, { className: 'w-5 h-5 mr-2' })}
                            {tab.name}
                        </button>); })}
                </nav>
            </div>
            <div className="mt-6 animate-fade-in">
                {tabs[activeTab] && tabs[activeTab].content}
            </div>
        </div>);
};
exports.default = Tabs;
