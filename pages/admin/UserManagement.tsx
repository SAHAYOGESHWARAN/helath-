
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, UserRole } from '../../types';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { useTable } from '../../hooks/useTable';
import PaginationControls from '../../components/shared/PaginationControls';
import { SearchIcon, SpinnerIcon } from '../../components/shared/Icons';
import Modal from '../../components/shared/Modal';
import { useApp } from '../../App';

const getRolePill = (role: UserRole) => {
    switch (role) {
        case UserRole.ADMIN: return 'bg-indigo-100 text-indigo-800';
        case UserRole.PROVIDER: return 'bg-teal-100 text-teal-800';
        case UserRole.PATIENT: return 'bg-blue-100 text-blue-800';
    }
};

const getStatusPill = (status: 'Active' | 'Suspended') => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
};

const UserManagement: React.FC = () => {
    const { users, verifyUser, updateUserStatus } = useAuth();
    const { showToast } = useApp();
    const [actionUser, setActionUser] = useState<User | null>(null);
    const [modalType, setModalType] = useState<'verify' | 'suspend' | 'activate' | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { 
        paginatedItems, 
        requestSort, 
        getSortArrow, 
        setGlobalFilter, 
        setColumnFilters,
        paginationProps 
    } = useTable<User>(users, 10);
    
    const handleAction = (user: User, action: 'verify' | 'suspend' | 'activate') => {
        setActionUser(user);
        setModalType(action);
    };
    
    const confirmAction = () => {
        if (!actionUser || !modalType) return;
        setIsSubmitting(true);
        setTimeout(() => {
            switch (modalType) {
                case 'verify':
                    verifyUser(actionUser.id);
                    showToast(`${actionUser.name} has been verified.`, 'success');
                    break;
                case 'suspend':
                    updateUserStatus(actionUser.id, 'Suspended');
                    showToast(`${actionUser.name} has been suspended.`, 'success');
                    break;
                case 'activate':
                    updateUserStatus(actionUser.id, 'Active');
                    showToast(`${actionUser.name} has been activated.`, 'success');
                    break;
            }
            setIsSubmitting(false);
            setActionUser(null);
            setModalType(null);
        }, 800);
    };

    return (
        <div>
            <PageHeader title="User Management" />
            <Card>
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div className="relative w-full md:max-w-xs">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search all fields..."
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <select onChange={(e) => setColumnFilters(prev => ({ ...prev, role: e.target.value }))} className="px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                            <option value="All">All Roles</option>
                            <option value="PATIENT">Patient</option>
                            <option value="PROVIDER">Provider</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                         <select onChange={(e) => setColumnFilters(prev => ({ ...prev, status: e.target.value }))} className="px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                            <option value="All">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Suspended">Suspended</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white">
                            <tr>
                                <th onClick={() => requestSort('name')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Name{getSortArrow('name')}</th>
                                <th onClick={() => requestSort('email')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Email{getSortArrow('email')}</th>
                                <th onClick={() => requestSort('role')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Role{getSortArrow('role')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedItems.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRolePill(user.role)}`}>{user.role}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusPill(user.status || 'Active')}`}>{user.status}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{user.isVerified ? 'Yes' : 'No'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                        {!user.isVerified && user.role === UserRole.PROVIDER && <button onClick={() => handleAction(user, 'verify')} className="text-green-600 hover:underline">Verify</button>}
                                        {user.status === 'Active' && <button onClick={() => handleAction(user, 'suspend')} className="text-red-600 hover:underline">Suspend</button>}
                                        {user.status === 'Suspended' && <button onClick={() => handleAction(user, 'activate')} className="text-blue-600 hover:underline">Activate</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <PaginationControls {...paginationProps} />
            </Card>

            <Modal
                isOpen={!!modalType}
                onClose={() => setModalType(null)}
                title={`Confirm ${modalType}`}
                footer={<>
                    <button onClick={() => setModalType(null)} className="bg-gray-200 font-bold py-2 px-4 rounded-lg">Cancel</button>
                    <button onClick={confirmAction} disabled={isSubmitting} className={`font-bold py-2 px-4 rounded-lg text-white w-32 flex justify-center ${modalType === 'verify' ? 'bg-green-600' : 'bg-red-600'}`}>
                        {isSubmitting ? <SpinnerIcon/> : 'Confirm'}
                    </button>
                </>}
            >
                <p>Are you sure you want to {modalType} the account for <strong>{actionUser?.name}</strong>?</p>
            </Modal>
        </div>
    );
};

export default UserManagement;