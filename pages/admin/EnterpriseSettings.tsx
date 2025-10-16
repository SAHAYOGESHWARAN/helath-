
import React from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';

const EnterpriseSettings: React.FC = () => {
    return (
        <div>
            <PageHeader title="Enterprise Settings" />
            <Card>
                <p>Interface for managing organization-level accounts and teams will be implemented here.</p>
            </Card>
        </div>
    );
};

export default EnterpriseSettings;