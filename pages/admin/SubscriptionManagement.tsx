
import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { User, UserRole } from '../../types';
import PageHeader from '../../components/shared/PageHeader';
import Modal from '../../components/shared/Modal';
import { useApp } from '../../App';
import { SpinnerIcon } from '../../components/shared/Icons';
import { useTable } from '../../hooks/useTable';
import PaginationControls from '../../components/shared/PaginationControls';

const SubscriptionManagement: React.FC = () => {
    const { users, providerSubscriptionPlans, updateUserSubscription } = useAuth();
    const { showToast } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<User | null>(null);
    const [selectedPlanId, setSelectedPlanId] = useState('');

    const providersWithFlatSubscription = useMemo(() => 
        users.filter(u => u.role === UserRole.PROVIDER).map(u => ({
            ...u,
            planName: u.subscription?.planName || 'N/A',
            planStatus: u.subscription?.status || 'N/A',
            renewalDate: u.subscription?.renewalDate || 'N/A',
        }))
    , [users]);

    const {
        paginatedItems,
        requestSort,
        getSortArrow,
        paginationProps
    } = useTable<any>(providersWithFlatSubscription, 10);

    const handleManageClick = (provider: User) => {
        setSelectedProvider(provider);
        setSelectedPlanId(provider.subscription?.planId || '');
        setIsModalOpen(true);
    };

    const handleSaveChanges = () => {
        if (!selectedProvider || !selectedPlanId) return;
        setIsSubmitting(true);
        setTimeout(() => {
            updateUserSubscription(selectedProvider.id, selectedPlanId);
            showToast(`${selectedProvider.name}'s subscription updated!`, 'success');
            setIsSubmitting(false);
            setIsModalOpen(false);
            setSelectedProvider(null);
        }, 1000);
    };

    return (
        <div>
            <PageHeader title="Subscription Management" subtitle="View and manage provider subscriptions." />
            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white">
                            <tr>
                                <th onClick={() => requestSort('name')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Provider<span className="text-gray-400">{getSortArrow('name')}</span></th>
                                <th onClick={() => requestSort('planName')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Current Plan<span className="text-gray-400">{getSortArrow('planName')}</span></th>
                                <th onClick={() => requestSort('planStatus')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Status<span className="text-gray-400">{getSortArrow('planStatus')}</span></th>
                                <th onClick={() => requestSort('renewalDate')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Renewal Date<span className="text-gray-400">{getSortArrow('renewalDate')}</span></th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedItems.map(provider => (
                                <tr key={provider.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{provider.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{provider.planName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{provider.planStatus}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{provider.renewalDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button onClick={() => handleManageClick(provider)} className="text-primary-600 hover:underline font-medium text-sm">Manage</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <PaginationControls {...paginationProps} />
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Manage Subscription for ${selectedProvider?.name}`}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Change Plan</label>
                        <select
                            value={selectedPlanId}
                            onChange={e => setSelectedPlanId(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white"
                        >
                            <option value="" disabled>Select a new plan</option>
                            {providerSubscriptionPlans.map(plan => (
                                <option key={plan.id} value={plan.id}>{plan.name} ({plan.price})</option>
                            ))}
                        </select>
                    </div>
                </div>
                 <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
                    <button onClick={() => setIsModalOpen(false)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                    <button onClick={handleSaveChanges} disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-36 flex justify-center items-center">
                        {isSubmitting ? <SpinnerIcon/> : 'Save Changes'}
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default SubscriptionManagement;
