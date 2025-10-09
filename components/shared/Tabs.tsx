import React, { useState, ReactElement } from 'react';

interface Tab {
    name: string;
    icon: ReactElement;
    content: ReactElement;
}

interface TabsProps {
    tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div>
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(index)}
                            className={`
                                flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                                transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 rounded-t-sm
                                ${
                                    activeTab === index
                                        ? 'border-primary-500 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
                            `}
                            aria-current={activeTab === index ? 'page' : undefined}
                        >
                            {React.cloneElement(tab.icon, { className: 'w-5 h-5 mr-2' })}
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="mt-6 animate-fade-in">
                {tabs[activeTab] && tabs[activeTab].content}
            </div>
        </div>
    );
};

export default Tabs;
