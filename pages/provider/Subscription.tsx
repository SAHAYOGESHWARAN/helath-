
import React from 'react';
import Card from '../../components/shared/Card';
import { SubscriptionPlan } from '../../types';
import { CheckCircleIcon } from '@heroicons/react/solid';

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className || "w-5 h-5"} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
);

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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Subscription</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card title="Current Plan">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-primary-600">{currentPlan.name}</h2>
                        <p className="text-xl font-semibold text-gray-700 mt-1">{currentPlan.price}</p>
                        <p className="text-sm text-gray-500 mt-2">Your plan renews on September 1, 2024.</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <button className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors">
                            Upgrade Plan
                        </button>
                    </div>
                </div>

                <div className="mt-6 border-t pt-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Plan Features:</h3>
                    <ul className="space-y-2">
                        {currentPlan.features.map(feature => (
                            <li key={feature} className="flex items-center text-gray-600">
                                <CheckIcon className="w-5 h-5 text-emerald-500 mr-2" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>
            </Card>
        </div>

        <div className="space-y-8">
            <Card title="Plan Usage">
                <p className="text-sm font-medium text-gray-600">Active Patients</p>
                <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold text-gray-800">{currentPatientCount}</p>
                    <p className="text-gray-500">/ {currentPlan.patientLimit}</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${usagePercentage}%` }}></div>
                </div>
            </Card>

            <Card title="Payment Method">
                <p className="font-medium text-gray-700">Visa ending in 4242</p>
                <p className="text-sm text-gray-500">Expires 12/2026</p>
                <button className="text-sm font-semibold text-primary-600 hover:underline mt-3">
                    Update Payment Method
                </button>
            </Card>
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
                                    <a href="#" className="text-primary-600 hover:text-primary-900">View Invoice</a>
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
