import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/shared/Card';
import { User, UserRole } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import PageHeader from '../../components/shared/PageHeader';
import { SearchIcon } from '../../components/shared/Icons';
import Modal from '../../components/shared/Modal';
import { useTable } from '../../hooks/useTable';
import PaginationControls from '../../components/shared/PaginationControls';
import { Table, ColumnDefinition } from '../../components/shared/Table';

const getStatusColor = (status: 'Active' | 'Suspended' | 'Inactive') => {
    switch(status) {
        case 'Active': return 'bg-emerald-100 text-emerald-800';
        case 'Suspended': return 'bg-red-100 text-red-800';
        case 'Inactive': return 'bg-gray-100 text-gray-800';
    }
};

const PatientQuickViewModal: React.FC<{ patient: User | null; onClose: () => void }> = ({ patient, onClose }) => {
    const navigate = useNavigate();
    if (!patient) return null;

    const latestVitals = patient.vitals && patient.vitals.length > 0 ? patient.vitals[0] : null;

    const viewFullChart = () => {
        onClose();
        navigate(`/patients/${patient.id}`);
    };

    return (
        <Modal isOpen={!!patient} onClose={onClose} title="Patient Quick View" size="lg">
            <div className="flex items-start space-x-6 p-4">
                <img src={patient.avatarUrl} alt={patient.name} className="w-24 h-24 rounded-full border-4 border-primary-100" />
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
                    <p className="text-gray-600">DOB: {patient.dob}</p>
                    <p className="text-sm text-gray-500 mt-1">Patient ID: <span className="font-mono">{patient.id}</span></p>
                </div>
            </div>
             <div className="mt-4 px-4">
                <Card title="Latest Vitals">
                     {latestVitals ? (
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-sm text-gray-500">Blood Pressure</p>
                                <p className="text-xl font-bold text-gray-800">{latestVitals.bloodPressure}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Heart Rate</p>
                                <p className="text-xl font-bold text-gray-800">{latestVitals.heartRate} <span className="text-sm font-normal">bpm</span></p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">BMI</p>
                                <p className="text-xl font-bold text-gray-800">{latestVitals.bmi || 'N/A'}</p>
                            </div>
                        </div>
                    ) : <p className="text-sm text-gray-500 text-center">No vitals recorded.</p>}
                </Card>
             </div>

            <div className="flex justify-end space-x-3 mt-6 p-4 border-t bg-gray-50 rounded-b-lg">
                <button onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Close</button>
                <button onClick={viewFullChart} className="bg-primary-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-700">View Full Chart</button>
            </div>
        </Modal>
    );
};

const PatientManagement: React.FC = () => {
    const { users } = useAuth();
    const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
    const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive' | 'Suspended'>('All');

    const patients = useMemo(() => users.filter(u => u.role === UserRole.PATIENT), [users]);
    
    const {
        paginatedItems,
        paginationProps,
        requestSort,
        getSortArrow,
        setGlobalFilter,
        setColumnFilters,
    } = useTable(patients, 10, { initialSort: { key: 'name', direction: 'asc' } });
    
    useEffect(() => {
        setColumnFilters(prev => ({ ...prev, status: statusFilter === 'All' ? '' : statusFilter }));
    }, [statusFilter, setColumnFilters]);
    
    const columns: ColumnDefinition<User>[] = [
        { accessorKey: 'name', header: 'Name', cell: (row) => <span className="font-medium text-gray-900">{row.name}</span> },
        { accessorKey: 'id', header: 'Patient ID', cellClassName: 'font-mono text-gray-500' },
        { accessorKey: 'dob', header: 'Date of Birth' },
        { accessorKey: 'status', header: 'Status', cell: (row) => (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(row.status as any)}`}>
                {row.status}
            </span>
        )},
        { accessorKey: 'actions', header: 'Actions', cell: (row) => (
            <button 
                onClick={(e) => { e.stopPropagation(); setSelectedPatient(row); }}
                className="text-primary-600 hover:text-primary-800 font-medium"
            >
                Quick View
            </button>
        )}
    ];

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
                            onChange={e => setGlobalFilter(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2 self-start md:self-center">
                        {(['All', 'Active', 'Inactive', 'Suspended'] as const).map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${statusFilter === status ? 'bg-primary-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
                
                <Table<User>
                    columns={columns}
                    data={paginatedItems}
                    onRowClick={setSelectedPatient}
                    requestSort={requestSort}
                    getSortArrow={getSortArrow}
                />
                
                <PaginationControls {...paginationProps} />
            </Card>
            <PatientQuickViewModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
        </div>
    );
};

export default PatientManagement;
