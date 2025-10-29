import React from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';
import { CurrencyDollarIcon } from '../../components/shared/Icons';

const Billing: React.FC = () => {
    // Mock data for demonstration
    const transactions = [
        { id: 'txn_1', date: '2024-08-15', provider: 'Dr. Jane Smith', type: 'Subscription', amount: 99.00, status: 'Success' },
        { id: 'txn_2', date: '2024-08-14', provider: 'Dr. David Chen', type: 'Subscription', amount: 49.00, status: 'Success' },
        { id: 'txn_3', date: '2024-08-12', provider: 'Healthcare Group LLC', type: 'Enterprise Plan', amount: 1200.00, status: 'Success' },
        { id: 'txn_4', date: '2024-08-10', provider: 'Dr. Emily White', type: 'Subscription', amount: 99.00, status: 'Failed' },
    ];

    return (
        <div>
            <PageHeader title="Platform Billing" subtitle="Manage and track all financial transactions." />
            
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="flex items-center p-4">
                    <div className="p-3 bg-emerald-100 rounded-full mr-4"><CurrencyDollarIcon className="w-6 h-6 text-emerald-600" /></div>
                    <div><p className="text-3xl font-bold text-gray-800">$1,447.00</p><p className="text-gray-500">Revenue (This Month)</p></div>
                </Card>
                <Card className="flex items-center p-4">
                     <div className="p-3 bg-blue-100 rounded-full mr-4"><CurrencyDollarIcon className="w-6 h-6 text-blue-600" /></div>
                    <div><p className="text-3xl font-bold text-gray-800">$15,820.00</p><p className="text-gray-500">Total Revenue (YTD)</p></div>
                </Card>
                <Card className="flex items-center p-4">
                     <div className="p-3 bg-red-100 rounded-full mr-4"><CurrencyDollarIcon className="w-6 h-6 text-red-600" /></div>
                    <div><p className="text-3xl font-bold text-gray-800">$99.00</p><p className="text-gray-500">Failed Transactions</p></div>
                </Card>
            </div>

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Transaction History</h3>
                    <div className="flex space-x-2">
                        <input type="date" className="p-2 border rounded-md text-sm" />
                        <button className="bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg text-sm">Export CSV</button>
                    </div>
                </div>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider/Org</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                             {transactions.length > 0 ? (
                                 transactions.map(tx => (
                                     <tr key={tx.id}>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{tx.id}</td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{tx.date}</td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tx.provider}</td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.type}</td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">${tx.amount.toFixed(2)}</td>
                                         <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 text-xs rounded-full ${tx.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{tx.status}</span></td>
                                     </tr>
                                 ))
                             ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-gray-500">
                                        No transactions to display.
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

export default Billing;