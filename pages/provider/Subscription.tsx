
import React, { useState } from 'react';
import Card from '../../components/shared/Card';
import { SubscriptionPlan } from '../../types';
import SubscriptionTierCard from '../../components/shared/SubscriptionTierCard';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../../components/shared/Modal';
import { useApp } from '../../App';

const billingHistory = [
    { id: 'inv_1', date: '2024-08-01', amount: 99.00, status: 'Paid' },
    { id: 'inv_2', date: '2024-07-01', amount: 99.00, status: 'Paid' },
    { id: 'inv_3', date: '2024-06-01', amount: 99.00, status: 'Paid' },
];

const Subscription: React.FC = () => {
    const { currentSubscription, changeSubscription, providerSubscriptionPlans } = useAuth();
    const { showToast } = useApp();
    const [modalState, setModalState] = useState<{ isOpen: boolean; plan: SubscriptionPlan | null }>({ isOpen: false, plan: null });

    const currentPatientCount = 85;
    
    if (!currentSubscription) {
        return <div>Loading subscription details...</div>;
    }
    
    const usagePercentage = currentSubscription.patientLimit > 0 
        ? (currentPatientCount / currentSubscription.patientLimit) * 100 
        : 0;

    const handleChoosePlan = (planId: string) => {
        const plan = providerSubscriptionPlans.find(p => p.id === planId);
        if (plan) {
            setModalState({ isOpen: true, plan });
        }
    };

    const handleConfirmChange = () => {
        if (modalState.plan) {
            changeSubscription(modalState.plan.id);
            showToast(`Successfully subscribed to ${modalState.plan.name}!`, 'success');
            setModalState({ isOpen: false, plan: null });
        }
    };


  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Subscription & Billing</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
            <p className="text-sm text-gray-500 font-medium">Current Plan</p>
            <p className="text-2xl font-bold text-primary-600 mt-1">{currentSubscription.name}</p>
        </Card>
        <Card>
            <p className="text-sm text-gray-500 font-medium">Active Patients</p>
            <div className="flex items-baseline space-x-2 mt-1">
                <p className="text-2xl font-bold text-gray-800">{currentPatientCount}</p>
                {currentSubscription.patientLimit > 0 && <p className="text-gray-500 text-sm">/ {currentSubscription.patientLimit}</p>}
            </div>
            {currentSubscription.patientLimit > 0 && 
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: `${usagePercentage}%` }}></div>
                </div>
            }
        </Card>
        <Card>
            <p className="text-sm text-gray-500 font-medium">Monthly Cost</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{currentSubscription.price.replace('/mo', '')}</p>
        </Card>
        <Card>
            <p className="text-sm text-gray-500 font-medium">Next Renewal</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">Sep 1, 2024</p>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Compare & Upgrade Plans</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {providerSubscriptionPlans.map(plan => (
                <SubscriptionTierCard 
                    key={plan.id}
                    plan={plan}
                    currentPlanName={currentSubscription.name}
                    onChoosePlan={handleChoosePlan}
                />
            ))}
        </div>
      </div>
      
       <div className="mt-8">
        <Card title="Billing History">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Invoice</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {billingHistory.map(item => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.amount.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <a href="#" className="text-primary-600 hover:text-primary-900">Download Invoice</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
      </div>

      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({isOpen: false, plan: null})}
        title="Confirm Subscription Change"
        footer={<>
            <button onClick={() => setModalState({isOpen: false, plan: null})} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
            <button onClick={handleConfirmChange} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Confirm</button>
        </>}
      >
        <p>Are you sure you want to change your plan to <strong>{modalState.plan?.name}</strong> for <strong>{modalState.plan?.price}</strong>?</p>
      </Modal>
    </div>
  );
};

export default Subscription;
