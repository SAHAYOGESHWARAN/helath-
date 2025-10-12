
import React from 'react';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import PageHeader from '../../components/shared/PageHeader';

const SubscriptionManagement: React.FC = () => {
    const { users, providerSubscriptionPlans, updateUserSubscription } = useAuth();
    const providers = users.filter(u => u.role === UserRole.PROVIDER);

    return (
        <div>
            <PageHeader title="Subscription Management" subtitle="View and manage provider subscriptions." />
            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Plan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Renewal Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change Plan</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {providers.map(provider => (
                                <tr key={provider.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{provider.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{provider.subscription?.planName || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{provider.subscription?.status || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{provider.subscription?.renewalDate || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={provider.subscription?.planId || ''}
                                            onChange={e => updateUserSubscription(provider.id, e.target.value)}
                                            className="border border-gray-300 rounded-md p-1"
                                        >
                                            <option value="" disabled>Select a plan</option>
                                            {providerSubscriptionPlans.map(plan => (
                                                <option key={plan.id} value={plan.id}>{plan.name} ({plan.price})</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default SubscriptionManagement;
