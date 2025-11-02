
import React, { useMemo } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import SubscriptionTierCard from '../../components/shared/SubscriptionTierCard';
import { useApp } from '../../App';
import Card from '../../components/shared/Card';

const ProviderSubscription: React.FC = () => {
  const { user, providerSubscriptionPlans, changeSubscription } = useAuth();
  const { showToast } = useApp();
  
  const currentPlan = useMemo(() => 
    providerSubscriptionPlans.find(p => p.id === user?.subscription?.planId),
    [user, providerSubscriptionPlans]
  );
  
  const activePatients = useMemo(() => 
    // This is a mock value, in a real app this would come from the backend or be calculated
    85,
    []
  );

  const handleChoosePlan = (planId: string) => {
    const chosenPlan = providerSubscriptionPlans.find(p => p.id === planId);
    if (chosenPlan) {
        changeSubscription(planId);
        showToast(`Subscription successfully changed to ${chosenPlan.name}!`, 'success');
    }
  };

  const MOCK_BILLING_HISTORY = [
      { id: 'inv_pro_1', date: '2024-08-01', description: 'Pro Tier Monthly', amount: 99.00 },
      { id: 'inv_pro_2', date: '2024-07-01', description: 'Pro Tier Monthly', amount: 99.00 },
      { id: 'inv_pro_3', date: '2024-06-01', description: 'Pro Tier Monthly', amount: 99.00 },
  ];

  return (
    <div>
      <PageHeader title="My Subscription" subtitle="Manage your practice's subscription plan." />
       <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
             <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Plans</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {providerSubscriptionPlans.map(plan => (
                    <SubscriptionTierCard 
                        key={plan.id}
                        plan={plan}
                        currentPlanName={currentPlan?.name || ''}
                        onChoosePlan={handleChoosePlan}
                    />
                ))}
            </div>
        </div>
        <div className="lg:col-span-2 space-y-8">
            <Card title="Current Plan & Usage">
                {currentPlan ? (
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-primary-600">{currentPlan.name}</h3>
                        <p className="font-semibold text-gray-700">{currentPlan.price}</p>
                        <p className="text-sm text-gray-500">Renews on: {user?.subscription?.renewalDate}</p>
                        
                        {currentPlan.patientLimit > 0 && (
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium">Active Patient Limit</span>
                                    <span>{activePatients} / {currentPlan.patientLimit}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div 
                                        className="bg-primary-600 h-2.5 rounded-full" 
                                        style={{ width: `${(activePatients / currentPlan.patientLimit) * 100}%`}}
                                    ></div>
                                </div>
                            </div>
                        )}
                         <ul className="text-sm space-y-2 pt-4 border-t">
                            {currentPlan.features.map(f => <li key={f} className="flex items-center text-gray-600">{f}</li>)}
                        </ul>
                    </div>
                ) : (
                    <p className="text-gray-500">No active subscription.</p>
                )}
            </Card>
             <Card title="Billing History">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2">Date</th>
                            <th className="py-2">Description</th>
                            <th className="py-2 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_BILLING_HISTORY.map(inv => (
                            <tr key={inv.id} className="border-b">
                                <td className="py-2 text-gray-500">{inv.date}</td>
                                <td className="py-2">{inv.description}</td>
                                <td className="py-2 text-right font-medium">${inv.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </Card>
        </div>
      </div>
    </div>
  );
};

export default ProviderSubscription;