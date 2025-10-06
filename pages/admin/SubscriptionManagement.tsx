import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';

const subscriptions = [
  { id: 'sub_1', providerName: 'Dr. Jane Smith', plan: 'Pro Tier', status: 'Active', renewalDate: '2025-08-15' },
  { id: 'sub_2', providerName: 'Dr. David Chen', plan: 'Basic Tier', status: 'Active', renewalDate: '2025-07-20' },
  { id: 'sub_3', providerName: 'Dr. Emily White', plan: 'Pro Tier', status: 'Cancelled', renewalDate: '2024-06-30' },
  { id: 'sub_4', providerName: 'Dr. Ben Carter', plan: 'Enterprise', status: 'Trialing', renewalDate: '2024-09-01' },
];

const SubscriptionManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubscriptions = useMemo(() =>
    subscriptions.filter(sub =>
      sub.providerName.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]
  );
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Trialing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Subscription Management</h1>
      <Card>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by provider name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Renewal</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscriptions.map(sub => (
                <tr key={sub.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{sub.providerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{sub.plan}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(sub.status)}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{sub.renewalDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" className="text-primary-600 hover:text-primary-900">Manage</a>
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