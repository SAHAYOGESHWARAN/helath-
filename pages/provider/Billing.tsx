
import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import { Claim, ClaimStatus, ClaimType } from '../../types';
import { CurrencyDollarIcon } from '../../components/shared/Icons';
import Modal from '../../components/shared/Modal';
import PageHeader from '../../components/shared/PageHeader';

const mockClaims: Claim[] = [
  { id: 'C1001', patientId: 'p1', status: ClaimStatus.PAID_IN_FULL, claimType: ClaimType.PROFESSIONAL, totalClaimChargeAmount: 250.00, createdAt: '2024-08-10', serviceDate: '2024-08-10', provider: 'Dr. Jane Smith', patientOwes: 0, insurancePaid: 250.00, lineItems: [{ service: 'Office Visit', charge: 250.00 }] },
  { id: 'C1002', patientId: 'p2', status: ClaimStatus.SUBMITTED, claimType: ClaimType.PROFESSIONAL, totalClaimChargeAmount: 150.00, createdAt: '2024-08-12', serviceDate: '2024-08-12', provider: 'Dr. Jane Smith', patientOwes: 20.00, insurancePaid: 130.00, lineItems: [{ service: 'Follow-up', charge: 150.00 }] },
  { id: 'C1003', patientId: 'p4', status: ClaimStatus.DENIED, claimType: ClaimType.PROFESSIONAL, totalClaimChargeAmount: 75.00, createdAt: '2024-08-05', serviceDate: '2024-08-05', provider: 'Dr. David Chen', patientOwes: 75.00, insurancePaid: 0.00, lineItems: [{ service: 'Lab Work', charge: 75.00 }], denialReason: "Not a covered service." },
  { id: 'C1004', patientId: 'p5', status: ClaimStatus.PROCESSING, claimType: ClaimType.PROFESSIONAL, totalClaimChargeAmount: 500.00, createdAt: '2024-08-14', serviceDate: '2024-08-14', provider: 'Anytown Hospital', patientOwes: 100.00, insurancePaid: 400.00, lineItems: [{ service: 'ER Visit', charge: 500.00 }] },
  { id: 'C1005', patientId: 'p1', status: ClaimStatus.DRAFT, claimType: ClaimType.PROFESSIONAL, totalClaimChargeAmount: 120.00, createdAt: '2024-08-15', serviceDate: '2024-08-15', provider: 'Dr. Jane Smith', patientOwes: 120.00, insurancePaid: 0.00, lineItems: [{ service: 'Consultation', charge: 120.00 }] },
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

const ClaimDetailModal: React.FC<{ claim: Claim | null; onClose: () => void; }> = ({ claim, onClose }) => {
    if (!claim) return null;

    return (
        <Modal isOpen={!!claim} onClose={onClose} title={`Details for Claim #${claim.id}`} size="lg">
            <div className="space-y-4">
                {claim.status === ClaimStatus.DENIED && (
                    <div className="p-3 bg-red-50 border-l-4 border-red-400 text-red-700">
                        <h4 className="font-bold">Denial Reason</h4>
                        <p className="text-sm">{claim.denialReason || 'No specific reason provided.'}</p>
                    </div>
                )}
                <div className="space-y-2">
                    <div className="flex justify-between"><span className="font-medium text-gray-600">Patient ID:</span><span className="font-semibold text-gray-800">{claim.patientId}</span></div>
                    <div className="flex justify-between"><span className="font-medium text-gray-600">Service Date:</span><span className="font-semibold text-gray-800">{claim.serviceDate}</span></div>
                    <div className="flex justify-between"><span className="font-medium text-gray-600">Total Billed:</span><span className="font-semibold text-gray-800">${claim.totalClaimChargeAmount.toFixed(2)}</span></div>
                     <div className="flex justify-between"><span className="font-medium text-gray-600">Insurance Paid:</span><span className="font-semibold text-gray-800">${claim.insurancePaid.toFixed(2)}</span></div>
                     <div className="flex justify-between"><span className="font-medium text-gray-600">Patient Owes:</span><span className="font-semibold text-gray-800">${claim.patientOwes.toFixed(2)}</span></div>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-800 mb-2 mt-4">Line Items</h4>
                    <ul className="space-y-1 border-t pt-2">
                        {claim.lineItems.map((item, index) => (
                            <li key={index} className="flex justify-between text-sm">
                                <span>{item.service}</span>
                                <span>${item.charge.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Modal>
    );
};

const Billing: React.FC = () => {
    const [claims, setClaims] = useState(mockClaims);
    const [filter, setFilter] = useState<ClaimStatus | 'All'>('All');
    const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

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
        <PageHeader title="Billing & Coding">
            <button className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
                <CurrencyDollarIcon className="w-5 h-5"/>
                <span>Create Superbill</span>
            </button>
        </PageHeader>
      
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
              <div className="flex space-x-2 border-b overflow-x-auto">
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
                    <thead className="bg-white">
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm"><button onClick={() => setSelectedClaim(claim)} className="text-primary-600 hover:underline">View</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
        <ClaimDetailModal claim={selectedClaim} onClose={() => setSelectedClaim(null)} />
    </div>
  );
};

export default Billing;