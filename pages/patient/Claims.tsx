
import React, { useState, useMemo } from 'react';
// FIX: Use `react-router-dom` for web-specific components.
import { useNavigate } from 'react-router-dom';
import Card from '../../components/shared/Card';
import { Claim, ClaimStatus } from '../../types';
import Modal from '../../components/shared/Modal';
import PageHeader from '../../components/shared/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { useTable } from '../../hooks/useTable';
import { Table, ColumnDefinition } from '../../components/shared/Table';
import PaginationControls from '../../components/shared/PaginationControls';


const getStatusColor = (status: ClaimStatus) => {
  switch (status) {
    case ClaimStatus.PAID_IN_FULL: return 'bg-green-100 text-green-800';
    case ClaimStatus.PROCESSING:
    case ClaimStatus.SUBMITTED:
       return 'bg-blue-100 text-blue-800';
    case ClaimStatus.DENIED:
    case ClaimStatus.REJECTED:
      return 'bg-red-100 text-red-800';
    case ClaimStatus.PAID_PARTIALLY:
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ClaimDetailModal: React.FC<{ claim: Claim | null; onClose: () => void; }> = ({ claim, onClose }) => {
    const navigate = useNavigate();

    if (!claim) return null;

    const handlePayNow = () => {
        onClose();
        navigate('/patient/payments');
    };

    return (
        <Modal isOpen={!!claim} onClose={onClose} title={`Explanation of Benefits`} size="lg">
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm p-4 bg-gray-50 rounded-lg border">
                    <div>
                        <p className="font-medium text-gray-500">Claim ID</p>
                        <p className="font-semibold text-gray-800 font-mono">{claim.id}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-500">Provider</p>
                        <p className="font-semibold text-gray-800">{claim.provider}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-500">Service Date</p>
                        <p className="font-semibold text-gray-800">{claim.serviceDate}</p>
                    </div>
                </div>

                {claim.status === ClaimStatus.DENIED && (
                    <div className="p-3 bg-red-50 border-l-4 border-red-400 text-red-700">
                        <h4 className="font-bold">Reason for Denial</h4>
                        <p className="text-sm">{claim.denialReason || 'No specific reason provided.'}</p>
                    </div>
                )}
                
                <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Services Provided</h4>
                     <div className="overflow-x-auto border rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Charge</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {claim.lineItems.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{item.service}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-right">${item.charge.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Financial Summary</h4>
                    <div className="space-y-2 text-sm border-t border-b divide-y">
                        <div className="flex justify-between py-2"><span className="text-gray-600">Total Billed Amount:</span><span className="font-medium text-gray-800">${claim.totalClaimChargeAmount.toFixed(2)}</span></div>
                        <div className="flex justify-between py-2"><span className="text-gray-600">Paid by Insurance:</span><span className="font-medium text-green-700">${claim.insurancePaid.toFixed(2)}</span></div>
                        <div className="flex justify-between py-2 text-base"><span className="font-semibold text-gray-800">Your Responsibility:</span><span className="font-bold text-red-600">${claim.patientOwes.toFixed(2)}</span></div>
                    </div>
                </div>

                {claim.patientOwes > 0 && (
                     <div className="pt-4 text-right">
                         <button onClick={handlePayNow} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded-lg">
                             Pay ${claim.patientOwes.toFixed(2)} Now
                         </button>
                     </div>
                )}

            </div>
        </Modal>
    );
};

const Claims: React.FC = () => {
  const { user, claims } = useAuth();
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  const myClaims = useMemo(() => claims.filter(c => c.patientId === user?.id), [claims, user]);

  const {
    paginatedItems,
    paginationProps,
    requestSort,
    getSortArrow,
    setGlobalFilter,
    setColumnFilters
  } = useTable(myClaims, 10, { initialSort: { key: 'serviceDate', direction: 'desc' }});
  
  const columns: ColumnDefinition<Claim>[] = [
    { accessorKey: 'id', header: 'Claim ID' },
    { accessorKey: 'serviceDate', header: 'Service Date' },
    { accessorKey: 'provider', header: 'Provider' },
    { accessorKey: 'totalClaimChargeAmount', header: 'Total Charge', cell: (row) => `$${row.totalClaimChargeAmount.toFixed(2)}` },
    { accessorKey: 'patientOwes', header: 'You Owe', cell: (row) => `$${row.patientOwes.toFixed(2)}`, cellClassName: 'font-semibold text-red-600'},
    { accessorKey: 'status', header: 'Status', cell: (row) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(row.status)}`}>
            {row.status.replace(/_/g, ' ')}
        </span>
    )},
    { accessorKey: 'actions', header: '', cell: (row) => (
        <button onClick={() => setSelectedClaim(row)} className="text-primary-600 hover:text-primary-900 font-medium">Details</button>
    ), cellClassName: 'text-right' },
  ];

  return (
    <div>
      <PageHeader title="My Claims" />
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <input
            type="text"
            placeholder="Search by Claim ID or Provider..."
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full sm:max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
          <select
            onChange={(e) => setColumnFilters(prev => ({...prev, status: e.target.value === 'All' ? '' : e.target.value}))}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="All">All Statuses</option>
            {Object.values(ClaimStatus).map(status => (
              <option key={status} value={status}>
                {status.replace(/_/g, ' ').charAt(0).toUpperCase() + status.replace(/_/g, ' ').slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
        
        <Table<Claim>
            columns={columns}
            data={paginatedItems}
            requestSort={requestSort}
            getSortArrow={getSortArrow}
            onRowClick={setSelectedClaim}
            emptyState={<div className="text-center py-10 text-gray-500">You have no claims on file.</div>}
        />
        <PaginationControls {...paginationProps} />
        
      </Card>
      <ClaimDetailModal claim={selectedClaim} onClose={() => setSelectedClaim(null)} />
    </div>
  );
};

export default Claims;