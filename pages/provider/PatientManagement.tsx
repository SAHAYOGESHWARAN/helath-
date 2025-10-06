import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import { Patient } from '../../types';

const mockPatients: (Patient & { vitals?: { bp: string; hr: number; bmi: number }})[] = [
    { id: 'p1', name: 'John Doe', dob: '1985-05-20', lastSeen: '2024-08-01', status: 'Active', vitals: { bp: '120/80', hr: 72, bmi: 24.5 } },
    { id: 'p2', name: 'Alice Johnson', dob: '1992-11-12', lastSeen: '2024-07-15', status: 'Active', vitals: { bp: '110/70', hr: 65, bmi: 22.1 } },
    { id: 'p3', name: 'Bob Williams', dob: '1970-02-01', lastSeen: '2023-12-10', status: 'Inactive', vitals: { bp: '135/85', hr: 78, bmi: 28.3 } },
    { id: 'p4', name: 'Charlie Brown', dob: '1998-09-30', lastSeen: '2024-08-10', status: 'Active', vitals: { bp: '115/75', hr: 68, bmi: 23.0 } },
    { id: 'p5', name: 'Diana Prince', dob: '1980-03-22', lastSeen: '2024-06-05', status: 'Active', vitals: { bp: '122/81', hr: 70, bmi: 21.5 } },
]

const getStatusColor = (status: 'Active' | 'Inactive') => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
};


const PatientSnapshotModal: React.FC<{ patient: Patient & { vitals?: any }, onClose: () => void }> = ({ patient, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 animate-fade-in-up">
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-4">
                            <img src={`https://picsum.photos/seed/${patient.id}/100`} alt="Patient Avatar" className="w-16 h-16 rounded-full border-2 border-primary-200" />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">{patient.name}</h2>
                                <p className="text-sm text-gray-500">DOB: {patient.dob}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="mt-6 border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Latest Vitals</h3>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-sm text-gray-500">Blood Pressure</p>
                                <p className="text-xl font-bold text-gray-800">{patient.vitals?.bp || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Heart Rate</p>
                                <p className="text-xl font-bold text-gray-800">{patient.vitals?.hr || 'N/A'} bpm</p>
                            </div>
                             <div>
                                <p className="text-sm text-gray-500">BMI</p>
                                <p className="text-xl font-bold text-gray-800">{patient.vitals?.bmi || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                     <div className="mt-6 border-t pt-6 grid grid-cols-2 gap-4">
                         <div>
                            <p className="text-sm text-gray-500">Last Appointment</p>
                            <p className="font-semibold text-gray-800">{patient.lastSeen}</p>
                         </div>
                         <div>
                             <p className="text-sm text-gray-500">Status</p>
                             <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(patient.status)}`}>
                                {patient.status}
                            </span>
                         </div>
                     </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end">
                    <button onClick={onClose} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors">
                        View Full Chart
                    </button>
                </div>
            </div>
        </div>
    );
};


const PatientManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Patient; direction: 'asc' | 'desc' } | null>(null);

    const [selectedPatient, setSelectedPatient] = useState<(Patient & { vitals?: any }) | null>(null);

    const sortedAndFilteredPatients = useMemo(() => {
        let filtered = mockPatients.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  p.status.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        if (sortConfig !== null) {
            filtered.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return filtered;
    }, [searchTerm, statusFilter, sortConfig]);

    const requestSort = (key: keyof Patient) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    
    const getSortArrow = (key: keyof Patient) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? '▲' : '▼';
    }
    
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Patient Management</h1>
      <Card>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <input 
                type="text" 
                placeholder="Search by name, ID, or status..." 
                className="w-full md:max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <div className="flex items-center space-x-2">
                <button onClick={() => setStatusFilter('All')} className={`px-4 py-2 text-sm font-medium rounded-md ${statusFilter === 'All' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>All</button>
                <button onClick={() => setStatusFilter('Active')} className={`px-4 py-2 text-sm font-medium rounded-md ${statusFilter === 'Active' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Active</button>
                <button onClick={() => setStatusFilter('Inactive')} className={`px-4 py-2 text-sm font-medium rounded-md ${statusFilter === 'Inactive' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Inactive</button>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th onClick={() => requestSort('name')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Name {getSortArrow('name')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient ID</th>
                        <th onClick={() => requestSort('lastSeen')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Last Seen {getSortArrow('lastSeen')}</th>
                        <th onClick={() => requestSort('status')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Status {getSortArrow('status')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sortedAndFilteredPatients.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{p.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.lastSeen}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(p.status)}`}>
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
      {selectedPatient && <PatientSnapshotModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />}
    </div>
  );
};

export default PatientManagement;