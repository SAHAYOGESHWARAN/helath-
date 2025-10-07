
import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import { Claim, ClaimStatus, ClaimType } from '../../types';
import { CurrencyDollarIcon } from '../../components/shared/Icons';

const mockClaims: Claim[] = [
  { id: 'C1001', patientId: 'p1', status: ClaimStatus.PAID_IN_FULL, claimType: ClaimType.PROFESSIONAL, totalClaimChargeAmount: 250.00, createdAt: '2024-08-10' },
  { id: 'C1002', patientId: 'p2', status: ClaimStatus.SUBMITTED, claimType: ClaimType.PROFESSIONAL, totalClaimChargeAmount: 150.00, createdAt: '2024-08-12' },
  { id: 'C1003', patientId: 'p4', status: ClaimStatus.DENIED, claimType: ClaimType.PROFESSIONAL, totalClaimChargeAmount: 75.00, createdAt: '2024-08-05' },
  { id: 'C1004', patientId: 'p5', status: ClaimStatus.PROCESSING, claimType: ClaimType.PROFESSIONAL, totalClaimChargeAmount: 500.00, createdAt: '2024-08-14' },
  { id: 'C1005', patientId: 'p1', status: ClaimStatus.DRAFT, claimType: ClaimType.PROFESSIONAL, totalClaimChargeAmount: 120.00, createdAt: '2024-08-15' },
];

const getStatusColor = (status: ClaimStatus) => {
  switch (status) {
    case ClaimStatus.PAID_IN_FULL: return 'bg-emerald-100 text-emerald-800';
    case ClaimStatus.SUBMITTED:
    case ClaimStatus.PROCESSING:
       return 'bg-blue-100 text-blue-800';
    case ClaimStatus.DENIED:
      return 'bg-red-100 text-red-800';
    case ClaimStatus.DRAFT:
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const Billing: React.FC = () => {
    const [claims, setClaims] = useState(mockClaims);
    const [filter, setFilter] = useState<ClaimStatus | 'All'>('All');

    const filteredClaims = useMemo(() => {
        if (filter === 'All') return claims;
        return claims.filter(c => c.status === filter);
    }, [claims, filter]);

    const metrics = useMemo(() => ({
        billedThisMonth: claims.reduce((acc, c) => acc + c.totalClaimChargeAmount, 0),
        outstanding: claims.filter(c => [ClaimStatus.SUBMITTED, ClaimStatus.PROCESSING].includes(c.status)).reduce((acc, c) => acc + c.totalClaimChargeAmount, 0)
    }), [claims]);

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Billing & Coding</h1>
            <button className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
                <CurrencyDollarIcon className="w-5 h-5"/>
                <span>Create Superbill</span>
            </button>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
                <p className="text-gray-500">Billed This Month</p>
                <p className="text-3xl font-bold text-gray-800">${metrics.billedThisMonth.toLocaleString()}</p>
            </Card>
            <Card>
                <p className="text-gray-500">Outstanding</p>
                <p className="text-3xl font-bold text-gray-800">${metrics.outstanding.toLocaleString()}</p>
            </Card>
            <Card>
                <p className="text-gray-500">Success Rate</p>
                <p className="text-3xl font-bold text-gray-800">96.8%</p>
            </Card>
        </div>

        <Card>
             <div className="mb-4">
              <div className="flex space-x-2 border-b">
                {(['All', ...Object.values(ClaimStatus)] as const).map(status => (
                    <button 
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`py-2 px-3 text-sm font-medium whitespace-nowrap ${filter === status ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
                    >
                        {status.replace(/_/g, ' ')}
                    </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claim ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredClaims.map(claim => (
                            <tr key={claim.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{claim.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{claim.patientId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{claim.createdAt}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">${claim.totalClaimChargeAmount.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(claim.status)}`}>{claim.status.replace(/_/g, ' ')}</span></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm"><a href="#" className="text-primary-600 hover:underline">View</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    </div>
  );
};

export default Billing;
