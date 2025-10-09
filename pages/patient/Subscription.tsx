import React from 'react';
import Card from '../../components/shared/Card';
import { SubscriptionPlan } from '../../types';
import { CheckCircleIcon, CreditCardIcon } from '../../components/shared/Icons';
import SubscriptionTierCard from '../../components/shared/SubscriptionTierCard';

const currentPlan: SubscriptionPlan = {
  name: 'Basic Care',
  price: '$19/month',
  patientLimit: 0, 
  features: [
    'Secure Messaging with Provider',
    'Appointment Scheduling',
    'Access to Health Records',
    'Basic AI Assistant Q&A',
  ],
};

const allPlans: (SubscriptionPlan & {isPopular?: boolean})[] = [
    {
        name: 'Basic Care',
        price: '$19/month',
        patientLimit: 0,
        features: [
            'Secure Messaging with Provider',
            'Appointment Scheduling',
            'Access to Health Records',
            'Basic AI Assistant Q&A',
        ],
    },
    {
        name: 'Plus Care',
        price: '$49/month',
        patientLimit: 0,
        isPopular: true,
        features: [
            'All features of Basic Care',
            'Priority Support',
            'Advanced AI Assistant Features',
            'Personalized Health Goal Tracking',
            'Quarterly Wellness Reports',
        ],
    },
     {
        name: 'Total Wellness',
        price: '$99/month',
        patientLimit: 0,
        features: [
            'All features of Plus Care',
            '24/7 On-Demand Nurse Chat',
            'Annual In-depth Health Review',
            'Family Plan Add-on Available',
        ],
    },
]

const billingHistory = [
    { id: 'inv_1', date: '2024-08-01', amount: 19.00, status: 'Paid' },
    { id: 'inv_2', date: '2024-07-01', amount: 19.00, status: 'Paid' },
];

const Subscription: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">My Subscription</h1>
      <p className="text-gray-600 mb-6">Manage your plan, billing, and payment details.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-1 flex flex-col gap-8">
           <Card title="Current Plan">
                <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                    <h3 className="text-2xl font-bold text-primary-700">{currentPlan.name}</h3>
                    <p className="text-gray-600 mt-1">Renews on August 31, 2025</p>
                </div>
                <ul className="space-y-3 mt-4 text-sm">
                    {currentPlan.features.map(feature => (
                        <li key={feature} className="flex items-center text-gray-700">
                            <CheckCircleIcon className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
          </Card>
          <Card title="Payment Method">
              <div className="flex items-center">
                <CreditCardIcon className="w-8 h-8 text-gray-400 mr-4"/>
                <div>
                    <p className="font-semibold text-gray-800">Visa ending in 4242</p>
                    <p className="text-sm text-gray-500">Expires 12 / 2026</p>
                </div>
              </div>
               <button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg text-sm">
                    Update Payment
                </button>
          </Card>
           <Card title="Billing History">
                <div className="space-y-3">
                    {billingHistory.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                            <div>
                                <p className="font-medium text-gray-800">Payment on {item.date}</p>
                                <a href="#" className="text-primary-600 hover:underline">Download Invoice</a>
                            </div>
                            <p className="font-semibold text-gray-600">${item.amount.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Upgrade Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allPlans.map(plan => (
                    <SubscriptionTierCard
                        key={plan.name}
                        plan={plan}
                        currentPlanName={currentPlan.name}
                    />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
