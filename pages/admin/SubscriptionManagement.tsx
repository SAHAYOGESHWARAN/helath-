import React from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';

const SubscriptionManagement: React.FC = () => {
    const { providerSubscriptionPlans } = useAuth();
    return (
        <div>
            <PageHeader title="Subscription Plan Management" />
            <Card>
                <p className="mb-4 text-gray-600">View and manage the subscription tiers available to providers on the platform.</p>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient Limit</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {providerSubscriptionPlans.length > 0 ? (
                                providerSubscriptionPlans.map(plan => (
                                    <tr key={plan.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{plan.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{plan.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.patientLimit > 0 ? plan.patientLimit : 'Unlimited'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button className="text-primary-600 hover:underline">Edit</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-10 text-gray-500">
                                        No subscription plans found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default SubscriptionManagement;