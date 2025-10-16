
import React from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';

const SystemSettings: React.FC = () => {
    return (
        <div>
            <PageHeader title="System Settings" />
            <Card>
                <p>System settings interface will be implemented here. This includes admin profile management, API keys, email templates, and other system configurations.</p>
            </Card>
        </div>
    );
};

export default SystemSettings;