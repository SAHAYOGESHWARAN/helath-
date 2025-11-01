import React from 'react';
import PageHeader from '../../components/shared/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import SubscriptionTierCard from '../../components/shared/SubscriptionTierCard';
import { useApp } from '../../App';
import Card from '../../components/shared/Card';

const ProviderSubscription: React.FC = () => {
  const { user, providerSubscriptionPlans, changeSubscription } = useAuth();
  const { showToast } = useApp();
  const currentPlan = providerSubscriptionPlans.find(p => p.id === user?.subscription?.planId);

  const handleChoosePlan = (planId: string) => {
    changeSubscription(planId);
    showToast(`Subscription changed successfully!`, 'success');
  };

  return (
    <div>
      <PageHeader title="My Subscription" subtitle="Manage your practice's subscription plan." />
       <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
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
        <div className="lg:col-span-2">
            <Card title="Current Plan Details">
                {currentPlan ? (
                    <div className="space-y-3">
                        <h3 className="text-xl font-bold text-primary-600">{currentPlan.name}</h3>
                        <p className="font-semibold">{currentPlan.price}</p>
                        <p className="text-sm text-gray-500">Renews on: {user?.subscription?.renewalDate}</p>
                        <ul className="text-sm space-y-2 pt-2 border-t">
                            {currentPlan.features.map(f => <li key={f}>{f}</li>)}
                        </ul>
                    </div>
                ) : (
                    <p className="text-gray-500">No active subscription.</p>
                )}
            </Card>
        </div>
      </div>
    </div>
  );
};

export default ProviderSubscription;
