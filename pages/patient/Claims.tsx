import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import { ClaimStatus } from '../../types';

const mockClaims = [
  { id: 'CLM78901', serviceDate: '2024-07-15', provider: 'Dr. Jane Smith', total: 450.00, patientOwes: 50.00, status: ClaimStatus.PAID_IN_FULL },
  { id: 'CLM78902', serviceDate: '2024-07-22', provider: 'Anytown General Hospital', total: 1250.00, patientOwes: 250.00, status: ClaimStatus.PROCESSING },
  { id: 'CLM78903', serviceDate: '2024-06-10', provider: 'Dr. David Chen', total: 180.00, patientOwes: 0.00, status: ClaimStatus.PAID_IN_FULL },
  { id: 'CLM78904', serviceDate: '2024-05-05', provider: 'Quest Diagnostics', total: 85.50, patientOwes: 20.00, status: ClaimStatus.DENIED },
  { id: 'CLM78905', serviceDate: '2024-08-01', provider: 'Dr. Jane Smith', total: 300.00, patientOwes: 50.00, status: ClaimStatus.SUBMITTED },
];

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

const Claims: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredClaims = useMemo(() => {
    return mockClaims.filter(claim => {
      const matchesStatus = statusFilter === 'All' || claim.status === statusFilter;
      const matchesSearch = claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            claim.provider.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, statusFilter]);
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
  };

  const isFiltered = searchTerm !== '' || statusFilter !== 'All';

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Claims</h1>
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
            <thead className="bg-gray-50">
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
                  <tr key={claim.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{claim.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{claim.serviceDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{claim.provider}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${claim.total.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${claim.patientOwes.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(claim.status)}`}>
                        {claim.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href="#" className="text-primary-600 hover:text-primary-900">Details</a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500">
                    No claims found matching your criteria.
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

export default Claims;