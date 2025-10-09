import React from 'react';
import Card from '../../components/shared/Card';
import { SubscriptionPlan } from '../../types';
import { CheckCircleIcon } from '../../components/shared/Icons';
import SubscriptionTierCard from '../../components/shared/SubscriptionTierCard';

const currentPlan: SubscriptionPlan = {
  name: 'Pro Tier',
  price: '$99/month',
  patientLimit: 200,
  features: [
    'Up to 200 active patients',
    'Full EHR & E-Prescribing',
    'Integrated Telehealth',
    'Advanced Reporting & Analytics',
    'Priority Email Support'
  ]
};

const allPlans: (SubscriptionPlan & {isPopular?: boolean})[] = [
    {
        name: 'Basic Tier',
        price: '$49/month',
        patientLimit: 50,
        features: [
            'Up to 50 active patients',
            'Basic EHR Features',
            'Appointment Scheduling',
            'Standard Email Support',
        ],
    },
    {
        name: 'Pro Tier',
        price: '$99/month',
        patientLimit: 200,
        isPopular: true,
        features: [
            'Up to 200 active patients',
            'Full EHR & E-Prescribing',
            'Integrated Telehealth',
            'Advanced Reporting & Analytics',
            'Priority Email Support',
        ],
    },
    {
        name: 'Enterprise',
        price: 'Contact Us',
        patientLimit: 0, // Unlimited
        features: [
            'Unlimited patients & providers',
            'All Pro features included',
            'Dedicated Account Manager',
            'Single Sign-On (SSO)',
            'Custom Integrations',
        ],
    }
];

const billingHistory = [
    { id: 'inv_1', date: '2024-08-01', amount: 99.00, status: 'Paid' },
    { id: 'inv_2', date: '2024-07-01', amount: 99.00, status: 'Paid' },
    { id: 'inv_3', date: '2024-06-01', amount: 99.00, status: 'Paid' },
];

const Subscription: React.FC = () => {
    const currentPatientCount = 85;
    const usagePercentage = (currentPatientCount / currentPlan.patientLimit) * 100;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Subscription & Billing</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
            <p className="text-sm text-gray-500 font-medium">Current Plan</p>
            <p className="text-2xl font-bold text-primary-600 mt-1">{currentPlan.name}</p>
        </Card>
        <Card>
            <p className="text-sm text-gray-500 font-medium">Active Patients</p>
            <div className="flex items-baseline space-x-2 mt-1">
                <p className="text-2xl font-bold text-gray-800">{currentPatientCount}</p>
                <p className="text-gray-500 text-sm">/ {currentPlan.patientLimit}</p>
            </div>
             <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: `${usagePercentage}%` }}></div>
            </div>
        </Card>
        <Card>
            <p className="text-sm text-gray-500 font-medium">Monthly Cost</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{currentPlan.price.replace('/month', '')}</p>
        </Card>
        <Card>
            <p className="text-sm text-gray-500 font-medium">Next Renewal</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">Sep 1, 2024</p>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Compare & Upgrade Plans</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {allPlans.map(plan => (
                <SubscriptionTierCard 
                    key={plan.name}
                    plan={plan}
                    currentPlanName={currentPlan.name}
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
    </div>
  );
};

export default Subscription;
