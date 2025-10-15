import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import { Claim, ClaimStatus } from '../../types';
import Modal from '../../components/shared/Modal';
import PageHeader from '../../components/shared/PageHeader';
import { useAuth } from '../../hooks/useAuth';

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
    if (!claim) return null;

    return (
        <Modal isOpen={!!claim} onClose={onClose} title={`Details for Claim #${claim.id}`} size="lg">
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm p-4 bg-gray-50 rounded-lg border">
                    <div>
                        <p className="font-medium text-gray-500">Provider</p>
                        <p className="font-semibold text-gray-800">{claim.provider}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-500">Service Date</p>
                        <p className="font-semibold text-gray-800">{claim.serviceDate}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-500">Status</p>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(claim.status)}`}>
                            {claim.status.replace(/_/g, ' ')}
                        </span>
                    </div>
                </div>

                {claim.status === ClaimStatus.DENIED && (
                    <div className="p-3 bg-red-50 border-l-4 border-red-400 text-red-700">
                        <h4 className="font-bold">Reason for Denial</h4>
                        <p className="text-sm">{claim.denialReason || 'No specific reason provided.'}</p>
                    </div>
                )}
                
                <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Financial Summary</h4>
                    <div className="space-y-2 text-sm border-t border-b divide-y">
                        <div className="flex justify-between py-2"><span className="text-gray-600">Total Billed Amount:</span><span className="font-medium text-gray-800">${claim.totalClaimChargeAmount.toFixed(2)}</span></div>
                        <div className="flex justify-between py-2"><span className="text-gray-600">Paid by Insurance:</span><span className="font-medium text-gray-800">${claim.insurancePaid.toFixed(2)}</span></div>
                        <div className="flex justify-between py-2 text-base"><span className="font-semibold text-gray-800">Your Responsibility:</span><span className="font-bold text-primary-600">${claim.patientOwes.toFixed(2)}</span></div>
                    </div>
                </div>
                
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

            </div>
        </Modal>
    );
};

const Claims: React.FC = () => {
  const { user, claims } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  const filteredClaims = useMemo(() => {
    return claims.filter(claim => {
      const matchesPatient = claim.patientId === user?.id;
      const matchesStatus = statusFilter === 'All' || claim.status === statusFilter;
      const matchesSearch = claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            claim.provider.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesPatient && matchesStatus && matchesSearch;
    });
  }, [searchTerm, statusFilter, claims, user]);
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
  };

  const isFiltered = searchTerm !== '' || statusFilter !== 'All';

  return (
    <div>
      <PageHeader title="My Claims" />
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
            <input
              type="text"
              placeholder="Search by Claim ID or Provider..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="All">All Statuses</option>
              {Object.values(ClaimStatus)
                .filter(status => status !== ClaimStatus.DRAFT && status !== ClaimStatus.PENDING_INFORMATION && status !== ClaimStatus.ADJUDICATED && status !== ClaimStatus.VOIDED) // Simplified list for patient view
                .map(status => (
                <option key={status} value={status}>
                  {status.replace(/_/g, ' ').charAt(0).toUpperCase() + status.replace(/_/g, ' ').slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            {isFiltered && (
              <button 
                onClick={handleClearFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 hover:text-gray-800 transition-colors"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Charge</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">You Owe</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Details</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClaims.length > 0 ? (
                filteredClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{claim.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{claim.serviceDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{claim.provider}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${claim.totalClaimChargeAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${claim.patientOwes.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(claim.status)}`}>
                        {claim.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => setSelectedClaim(claim)} className="text-primary-600 hover:text-primary-900 font-medium">Details</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500">
                    You have no claims on file.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <ClaimDetailModal claim={selectedClaim} onClose={() => setSelectedClaim(null)} />
    </div>
  );
};

export default Claims;