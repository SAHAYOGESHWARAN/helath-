import React from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';
import Tabs from '../../components/shared/Tabs';
import { BellIcon, ShieldCheckIcon } from '../../components/shared/Icons';

const NotificationsTab: React.FC = () => (
    <Card>
        <p>Provider notification settings coming soon.</p>
    </Card>
);

const SecurityTab: React.FC = () => (
    <Card>
        <p>Provider security settings coming soon.</p>
    </Card>
);

const ProviderSettings: React.FC = () => {
    const tabs = [
        { name: 'Notifications', icon: <BellIcon/>, content: <NotificationsTab /> },
        { name: 'Security', icon: <ShieldCheckIcon/>, content: <SecurityTab /> },
    ];
    
    return (
        <div>
            <PageHeader title="Settings" subtitle="Manage your provider account preferences and security." />
             <div className="max-w-3xl mx-auto">
                 <Card className="p-0">
                    <Tabs tabs={tabs} />
                </Card>
             </div>
        </div>
    );
};

export default ProviderSettings;
