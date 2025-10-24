
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/shared/Card';
import { User, UserRole } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import PageHeader from '../../components/shared/PageHeader';
import { SearchIcon } from '../../components/shared/Icons';

const getStatusColor = (status: 'Active' | 'Suspended') => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
};


const PatientSnapshotModal: React.FC<{ patient: User | null, onClose: () => void }> = ({ patient, onClose }) => {
    const navigate = useNavigate();

    if (!patient) return null;

    const handleViewChart = () => {
        navigate(`/patients/${patient.id}`);
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 animate-fade-in-up">
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-4">
                            <img src={patient.avatarUrl} alt="Patient Avatar" className="w-16 h-16 rounded-full border-2 border-primary-200" />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">{patient.name}</h2>
                                <p className="text-sm text-gray-500">DOB: {patient.dob}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                     <div className="mt-6 border-t pt-6 grid grid-cols-2 gap-4">
                         <div>
                             <p className="text-sm text-gray-500">State</p>
                            <p className="font-semibold text-gray-800">{patient.state}</p>
                         </div>
                         <div>
                             <p className="text-sm text-gray-500">Status</p>
                             <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(patient.status || 'Active')}`}>
                                {patient.status}
                            </span>
                         </div>
                     </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end">
                    <button onClick={handleViewChart} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors">
                        View Full Chart
                    </button>
                </div>
            </div>
        </div>
    );
};


const PatientManagement: React.FC = () => {
    const { user: providerUser, users } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Suspended'>('All');
    const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' } | null>(null);

    const [selectedPatient, setSelectedPatient] = useState<User | null>(null);

    const sortedAndFilteredPatients = useMemo(() => {
        if (!providerUser?.state) return [];
        
        let filtered = users.filter(p => {
            const matchesState = p.state === providerUser.state;
            const isPatient = p.role === UserRole.PATIENT;
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  (p.status || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
            return isPatient && matchesState && matchesSearch && matchesStatus;
        });

        if (sortConfig !== null) {
            filtered.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];
                
                if (aVal === undefined || aVal === null) return 1;
                if (bVal === undefined || bVal === null) return -1;

                let comparison = 0;
                if (typeof aVal === 'string' && typeof bVal === 'string') {
                    comparison = aVal.localeCompare(bVal);
                } else {
                    if (aVal < bVal) comparison = -1;
                    if (aVal > bVal) comparison = 1;
                }
                
                return sortConfig.direction === 'asc' ? comparison : -comparison;
            });
        }
        return filtered;
    }, [searchTerm, statusFilter, sortConfig, users, providerUser]);

    const requestSort = (key: keyof User) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    
    const getSortArrow = (key: keyof User) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? '▲' : '▼';
    }
    
  return (
    <div>
      <PageHeader title="Patient Management" />
      <Card>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div className="relative w-full md:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                    type="text" 
                    placeholder="Search by name, ID, or status..." 
                    className="w-full pl-10 pr-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex items-center space-x-2">
                <button onClick={() => setStatusFilter('All')} className={`px-4 py-2 text-sm font-medium rounded-md ${statusFilter === 'All' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>All</button>
                <button onClick={() => setStatusFilter('Active')} className={`px-4 py-2 text-sm font-medium rounded-md ${statusFilter === 'Active' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Active</button>
                <button onClick={() => setStatusFilter('Suspended')} className={`px-4 py-2 text-sm font-medium rounded-md ${statusFilter === 'Suspended' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Suspended</button>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                    <tr>
                        <th onClick={() => requestSort('name')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Name {getSortArrow('name')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient ID</th>
                        <th onClick={() => requestSort('dob')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Date of Birth {getSortArrow('dob')}</th>
                        <th onClick={() => requestSort('status')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Status {getSortArrow('status')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sortedAndFilteredPatients.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{p.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.dob}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(p.status || 'Active')}`}>
                                    {p.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <button 
                                    onClick={() => setSelectedPatient(p)}
                                    className="text-primary-600 hover:text-primary-800 font-medium"
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </Card>
      <PatientSnapshotModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
    </div>
  );
};

export default PatientManagement;
