import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import { User, UserRole } from '../../types';
import { useApp } from '../../App';
import PageHeader from '../../components/shared/PageHeader';
import Modal from '../../components/shared/Modal';
import { SearchIcon, FilterIcon } from '../../components/shared/Icons';

const mockUsers: User[] = [
    { id: 'pat1', name: 'John Doe', email: 'john.doe@email.com', role: UserRole.PATIENT, dob: '1985-05-20' },
    { id: 'pro1', name: 'Dr. Jane Smith', email: 'jane.smith@email.com', role: UserRole.PROVIDER, specialty: 'Cardiology' },
    { id: 'adm1', name: 'Alex Johnson', email: 'alex.j@email.com', role: UserRole.ADMIN },
    { id: 'pat2', name: 'Alice Johnson', email: 'alice.j@email.com', role: UserRole.PATIENT, dob: '1992-11-12' },
    { id: 'pro2', name: 'Dr. David Chen', email: 'david.chen@email.com', role: UserRole.PROVIDER, specialty: 'Dermatology' },
    { id: 'pat3', name: 'Charlie Brown', email: 'charlie.b@email.com', role: UserRole.PATIENT, dob: '1998-09-30' },
    { id: 'pro3', name: 'Dr. Emily White', email: 'emily.white@email.com', role: UserRole.PROVIDER, specialty: 'Pediatrics' },
    { id: 'adm2', name: 'Maria Garcia', email: 'maria.g@email.com', role: UserRole.ADMIN },
];


const UserManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const { showToast } = useApp();
    const [modalState, setModalState] = useState<{ isOpen: boolean; user: User | null; action: 'Suspend' | 'Reset Password' | 'Edit' | null }>({ isOpen: false, user: null, action: null });
    const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' } | null>({ key: 'name', direction: 'asc' });

    const handleActionClick = (user: User, action: 'Suspend' | 'Reset Password' | 'Edit') => {
        if (action === 'Edit') {
             showToast(`Editing user ${user.name}.`, 'info');
             // In a real app, this would open an edit form/modal.
        } else {
            setModalState({ isOpen: true, user, action });
        }
    };

    const handleModalClose = () => {
        setModalState({ isOpen: false, user: null, action: null });
    };

    const handleConfirmAction = () => {
        if (modalState.user && modalState.action) {
            showToast(`${modalState.action} action confirmed for ${modalState.user.name}.`, 'success');
            // In a real app, you'd dispatch the action here (e.g., API call).
        }
        handleModalClose();
    };

    const filteredAndSortedUsers = useMemo(() => {
        let filtered = mockUsers.filter(user => {
            const matchesRole = roleFilter === 'All' || user.role === roleFilter;
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesRole && matchesSearch;
        });

        if (sortConfig !== null) {
            filtered.sort((a, b) => {
                const valA = a[sortConfig.key] ?? '';
                const valB = b[sortConfig.key] ?? '';

                if (valA < valB) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (valA > valB) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        
        return filtered;
    }, [searchTerm, roleFilter, sortConfig]);

    const requestSort = (key: keyof User) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

  return (
    <div>
      <PageHeader title="User Management" buttonText="Invite New User" onButtonClick={() => showToast('Invite user flow started!', 'info')}/>
      
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <div className="relative w-full sm:max-w-sm">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <div className="relative w-full sm:w-auto">
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 appearance-none"
                >
                    <option value="All">All Roles</option>
                    <option value={UserRole.PATIENT}>Patient</option>
                    <option value={UserRole.PROVIDER}>Provider</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                </select>
                <FilterIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
        </div>
        <div className="overflow-x-auto mt-4">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th 
                            onClick={() => requestSort('name')} 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer select-none hover:bg-gray-100 group"
                        >
                            <div className="flex items-center">
                                Name 
                                <span className="ml-1.5 text-gray-400">
                                    {sortConfig?.key === 'name' 
                                        ? (sortConfig.direction === 'asc' ? '▲' : '▼')
                                        : <span className="opacity-0 group-hover:opacity-100 transition-opacity">↕</span>
                                    }
                                </span>
                            </div>
                        </th>
                        <th 
                            onClick={() => requestSort('email')} 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer select-none hover:bg-gray-100 group"
                        >
                             <div className="flex items-center">
                                Email 
                                <span className="ml-1.5 text-gray-400">
                                    {sortConfig?.key === 'email' 
                                        ? (sortConfig.direction === 'asc' ? '▲' : '▼')
                                        : <span className="opacity-0 group-hover:opacity-100 transition-opacity">↕</span>
                                    }
                                </span>
                            </div>
                        </th>
                        <th 
                            onClick={() => requestSort('role')} 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer select-none hover:bg-gray-100 group"
                        >
                            <div className="flex items-center">
                                Role 
                                <span className="ml-1.5 text-gray-400">
                                    {sortConfig?.key === 'role' 
                                        ? (sortConfig.direction === 'asc' ? '▲' : '▼')
                                        : <span className="opacity-0 group-hover:opacity-100 transition-opacity">↕</span>
                                    }
                                </span>
                            </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAndSortedUsers.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                               <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                 user.role === UserRole.ADMIN ? 'bg-gray-200 text-gray-800' :
                                 user.role === UserRole.PROVIDER ? 'bg-accent-light text-accent-dark' :
                                 'bg-primary-100 text-primary-800'
                               }`}>{user.role}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                <button onClick={() => handleActionClick(user, 'Edit')} className="text-primary-600 hover:text-primary-900">Edit</button>
                                <button onClick={() => handleActionClick(user, 'Suspend')} className="text-yellow-600 hover:text-yellow-900">Suspend</button>
                                <button onClick={() => handleActionClick(user, 'Reset Password')} className="text-red-600 hover:text-red-900">Reset Pass</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </Card>
      
      <Modal
        isOpen={modalState.isOpen}
        onClose={handleModalClose}
        title={`Confirm ${modalState.action}`}
        footer={
            <>
                <button onClick={handleModalClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">
                    Cancel
                </button>
                <button 
                    onClick={handleConfirmAction} 
                    className={`font-bold py-2 px-4 rounded-lg text-white ${modalState.action === 'Suspend' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-500 hover:bg-red-600'}`}
                >
                    Confirm {modalState.action}
                </button>
            </>
        }
      >
        <p>Are you sure you want to {modalState.action?.toLowerCase()} the account for <strong className="text-gray-800">{modalState.user?.name}</strong>?</p>
        {modalState.action === 'Reset Password' && <p className="text-sm text-gray-500 mt-2">This will send a password reset link to the user's email address.</p>}
        {modalState.action === 'Suspend' && <p className="text-sm text-gray-500 mt-2">This will temporarily prevent the user from logging in.</p>}
      </Modal>

    </div>
  );
};

export default UserManagement;
