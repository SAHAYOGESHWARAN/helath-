import React from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';
import { InboxIcon } from '../../components/shared/Icons';

const Inbox: React.FC = () => {
    return (
        <div>
            <PageHeader title="Inbox" subtitle="This feature is under development." />
            <Card>
                <div className="text-center p-8 text-gray-500">
                    <InboxIcon className="w-16 h-16 mx-auto mb-4 text-gray-300"/>
                    <h3 className="text-xl font-semibold">Coming Soon</h3>
                    <p className="mt-2">The integrated inbox for labs, referrals, and system messages will be available here.</p>
                </div>
            </Card>
        </div>
    );
};

export default Inbox;