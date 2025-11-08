
import React from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { User, UserRole } from '../../types';
// FIX: Use `react-router-dom` for web-specific components.
import { Link } from 'react-router-dom';
import { useTable } from '../../hooks/useTable';
import PaginationControls from '../../components/shared/PaginationControls';
import { Table, ColumnDefinition } from '../../components/shared/Table';

const getStatusPill = (status: 'Active' | 'Cancelled' | 'Trialing') => {
    switch (status) {
        case 'Active': return 'bg-emerald-100 text-emerald-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        case 'Trialing': return 'bg-blue-100 text-blue-800';
    }
};

const SubscriptionManagement: React.FC = () => {
    const { users, providerSubscriptionPlans } = useAuth();

    const subscribedProviders = React.useMemo(() => {
        return users
            .filter(u => u.role === UserRole.PROVIDER && u.subscription)
            .map(u => {
                const plan = providerSubscriptionPlans.find(p => p.id === u.subscription!.planId);
                return {
                    ...u,
                    planName: plan?.name || 'Unknown Plan',
                    subscriptionStatus: u.subscription!.status,
                    renewalDate: u.subscription!.renewalDate,
                };
            });
    }, [users, providerSubscriptionPlans]);

    const {
        paginatedItems,
        paginationProps,
        requestSort,
        getSortArrow,
    } = useTable(subscribedProviders, 10);
    
    const columns: ColumnDefinition<typeof subscribedProviders[0]>[] = [
        { accessorKey: 'name', header: 'Provider Name' },
        { accessorKey: 'planName', header: 'Plan' },
        { accessorKey: 'subscriptionStatus', header: 'Status', cell: (row) => (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusPill(row.subscriptionStatus)}`}>
                {row.subscriptionStatus}
            </span>
        )},
        { accessorKey: 'renewalDate', header: 'Next Renewal' },
        { accessorKey: 'actions', header: 'Actions', cell: () => <button className="text-primary-600 hover:underline">Manage</button> }
    ];

    return (
        <div>
            <PageHeader title="Provider Subscriptions" subtitle="View and manage active provider subscriptions." />
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-600">A list of all providers with an active or past subscription plan.</p>
                    <Link to="/admin/plans" className="text-primary-600 font-semibold hover:underline">
                        Manage Subscription Plans &rarr;
                    </Link>
                </div>
                <Table<typeof subscribedProviders[0]>
                    columns={columns}
                    data={paginatedItems}
                    requestSort={requestSort}
                    getSortArrow={getSortArrow}
                />
                <PaginationControls {...paginationProps} />
            </Card>
        </div>
    );
};

export default SubscriptionManagement;