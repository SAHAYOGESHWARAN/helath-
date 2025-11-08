import React, { useState } from 'react';

export type TabItem = { name: string; icon?: React.ReactNode; content: React.ReactNode };

export const Tabs: React.FC<{ defaultValue?: string; tabs?: TabItem[]; children?: React.ReactNode }> = ({ defaultValue, tabs, children }) => {
    const initial = defaultValue ?? (tabs && tabs.length ? tabs[0].name : '');
    const [activeTab, setActiveTab] = useState(initial);

    // If tabs prop provided, render a simple tab UI that many pages expect
    if (tabs && tabs.length) {
        return (
            <div>
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                        {tabs.map(t => (
                            <button key={t.name} onClick={() => setActiveTab(t.name)} className={`flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === t.name ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                {t.icon && <span className="mr-2">{t.icon}</span>}
                                <span>{t.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="mt-6 animate-fade-in">
                    {tabs.map(t => t.name === activeTab ? <div key={t.name}>{t.content}</div> : null)}
                </div>
            </div>
        );
    }

    return (
        <div>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    // cast to any so we can attach runtime props without TS errors
                    return React.cloneElement(child as React.ReactElement<any>, { activeTab, setActiveTab } as any);
                }
                return child;
            })}
        </div>
    );
};

export const TabsList: React.FC<{ activeTab?: string; setActiveTab?: (value: string) => void; children: React.ReactNode }> = ({ activeTab, setActiveTab, children }) => (
    <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<any>, { activeTab, setActiveTab } as any);
                }
                return child;
            })}
        </nav>
    </div>
);

export const TabsTrigger: React.FC<{ value: string; activeTab?: string; setActiveTab?: (value: string) => void; children: React.ReactNode }> = ({ value, activeTab, setActiveTab, children }) => (
    <button
        onClick={() => setActiveTab && setActiveTab(value)}
        className={`
            flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
            transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 rounded-t-sm
            ${
                activeTab === value
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }
        `}
        aria-current={activeTab === value ? 'page' : undefined}
    >
        {children}
    </button>
);

export const TabsContent: React.FC<{ value: string; activeTab?: string; children: React.ReactNode }> = ({ value, activeTab, children }) => {
    if (value !== activeTab) {
        return null;
    }

    return <div className="mt-6 animate-fade-in">{children}</div>;
};

export default Tabs;