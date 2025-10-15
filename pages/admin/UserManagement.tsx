import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, UserRole } from '../../types';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import Modal from '../../components/shared/Modal';
import { useApp } from '../../App';
import { SearchIcon, SpinnerIcon, CheckCircleIcon, DownloadIcon } from '../../components/shared/Icons';
import SkeletonTableRow from '../../components/shared/skeletons/SkeletonTableRow';
import { useTable } from '../../hooks/useTable';
import PaginationControls from '../../components/shared/PaginationControls';

const UserForm: React.FC<{ user: Partial<User> | null; onSave: (user: Partial<User>) => void; onCancel: () => void; isSubmitting: boolean; }> = ({ user, onSave, onCancel, isSubmitting }) => {
    const [formData, setFormData] = useState({ id: user?.id, name: user?.name || '', email: user?.email || '', role: user?.role || UserRole.PATIENT });
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(formData); };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" value={formData.name} onChange={e => setFormData(f => ({...f, name: e.target.value}))} className="w-full p-2 border border-gray-300 rounded-md" placeholder="Full Name" required />
            <input type="email" name="email" value={formData.email} onChange={e => setFormData(f => ({...f, email: e.target.value}))} className="w-full p-2 border border-gray-300 rounded-md" placeholder="Email" required />
            <select name="role" value={formData.role} onChange={e => setFormData(f => ({...f, role: e.target.value as UserRole}))} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
            </select>
            <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-36 flex justify-center items-center">
                    {isSubmitting ? <SpinnerIcon/> : 'Save Changes'}
                </button>
            </div>
        </form>
    );
};

const UserManagement: React.FC = () => {
    const { users, addUser, editUser, deleteUser, verifyProvider } = useAuth();
    const { showToast } = useApp();
    const [modal, setModal] = useState<'edit' | 'delete' | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const {
        paginatedItems,
        sortedAndFilteredItems,
        requestSort,
        getSortArrow,
        setGlobalFilter,
        setColumnFilters,
        paginationProps
    } = useTable<User>(users, 10);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGlobalFilter(e.target.value);
    };

    const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setColumnFilters(prev => ({ ...prev, role: e.target.value }));
    };

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 350);
        return () => clearTimeout(timer);
    }, []);

    const handleSaveUser = (userData: Partial<User>) => {
        setIsSubmitting(true);
        setTimeout(() => {
            if (userData.id) {
                editUser(userData as User);
                showToast('User updated successfully!', 'success');
            } else {
                addUser(userData as Omit<User, 'id'>);
                showToast('User added successfully!', 'success');
            }
            setIsSubmitting(false);
            setModal(null);
            setSelectedUser(null);
        }, 1000);
    };

    const handleDeleteUser = () => {
        if (!selectedUser) return;
        setIsSubmitting(true);
        setTimeout(() => {
            deleteUser(selectedUser.id);
            showToast('User deleted.', 'success');
            setIsSubmitting(false);
            setModal(null);
            setSelectedUser(null);
        }, 1000);
    };

    const handleToggleSuspend = (userToToggle: User) => {
        const newStatus = userToToggle.status === 'Active' ? 'Suspended' : 'Active';
        editUser({ ...userToToggle, status: newStatus });
        showToast(`User ${userToToggle.name} has been ${newStatus === 'Active' ? 'activated' : 'suspended'}.`, 'success');
    };
    
    const handleVerify = (userId: string) => {
        verifyProvider(userId);
        showToast('Provider license has been verified!', 'success');
    };

    const openModal = (type: 'edit' | 'delete', user: User | null = null) => {
        setSelectedUser(user);
        setModal(type);
    };

    const handleExport = () => {
        if (sortedAndFilteredItems.length === 0) {
            showToast('No data to export.', 'info');
            return;
        }

        const headers = ["ID", "Name", "Email", "Role", "Status", "State", "License Number", "Verification Status"];
        
        const csvRows = sortedAndFilteredItems.map(user => {
            const verificationStatus = user.role === UserRole.PROVIDER 
                ? (user.isVerified ? "Verified" : "Not Verified")
                : "N/A";
            
            const escapeCsvCell = (cell: string | undefined | null) => {
                if (cell === undefined || cell === null) return '';
                const str = String(cell);
                if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                    return `"${str.replace(/"/g, '""')}"`;
                }
                return str;
            };

            return [
                user.id,
                escapeCsvCell(user.name),
                escapeCsvCell(user.email),
                escapeCsvCell(user.role),
                escapeCsvCell(user.status || 'Active'),
                escapeCsvCell(user.state),
                escapeCsvCell(user.licenseNumber),
                verificationStatus
            ].join(',');
        });

        const csvContent = [headers.join(','), ...csvRows].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'user_data_export.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
        showToast('User data exported!', 'success');
    };


    return (
        <div>
            <PageHeader 
                title="User Management" 
                buttonText="Add New User" 
                onButtonClick={() => openModal('edit')}
            >
                 <button
                    onClick={handleExport}
                    className="bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-lg flex items-center space-x-2 border border-gray-300 shadow-sm"
                >
                    <DownloadIcon className="w-5 h-5"/>
                    <span>Export CSV</span>
                </button>
            </PageHeader>
            <Card>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                    <div className="relative w-full md:max-w-xs">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="h-5 w-5 text-gray-400" /></div>
                        <input type="text" placeholder="Search..." onChange={handleSearchChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"/>
                    </div>
                    <select onChange={handleRoleFilterChange} className="w-full md:w-auto p-2 border-gray-300 rounded-md bg-white">
                        <option value="All">All Roles</option>
                        {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white">
                            <tr>
                                <th onClick={() => requestSort('name')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Name<span className="text-gray-400">{getSortArrow('name')}</span></th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                                <th onClick={() => requestSort('role')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Role<span className="text-gray-400">{getSortArrow('role')}</span></th>
                                <th onClick={() => requestSort('status')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Status<span className="text-gray-400">{getSortArrow('status')}</span></th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verification</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} columns={6} />)
                            ) : paginatedItems.map(user => (
                                <tr key={user.id} className={user.status === 'Suspended' ? 'bg-amber-50' : ''}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt="" />
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.role === UserRole.PROVIDER ? (
                                            <>
                                                <div>Lic: {user.licenseNumber}</div>
                                                <div>State: {user.state}</div>
                                            </>
                                        ) : (
                                            <div>State: {user.state}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {user.role === UserRole.PROVIDER ? (
                                            user.isVerified ? (
                                                <span className="flex items-center text-xs font-semibold text-emerald-800">
                                                    <CheckCircleIcon className="w-4 h-4 mr-1"/> Verified
                                                </span>
                                            ) : (
                                                <button onClick={() => handleVerify(user.id)} className="px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200">
                                                    Verify Now
                                                </button>
                                            )
                                        ) : (<span className="text-gray-400">N/A</span>)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                        <button onClick={() => openModal('edit', user)} className="text-primary-600 hover:underline">Edit</button>
                                        <button onClick={() => handleToggleSuspend(user)} className={user.status === 'Active' ? 'text-amber-600 hover:underline' : 'text-emerald-600 hover:underline'}>
                                            {user.status === 'Active' ? 'Suspend' : 'Activate'}
                                        </button>
                                        <button onClick={() => openModal('delete', user)} className="text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <PaginationControls {...paginationProps} />
            </Card>

            <Modal isOpen={modal === 'edit'} onClose={() => setModal(null)} title={selectedUser ? 'Edit User' : 'Add New User'}>
                <UserForm user={selectedUser} onSave={handleSaveUser} onCancel={() => setModal(null)} isSubmitting={isSubmitting} />
            </Modal>

            <Modal isOpen={modal === 'delete'} onClose={() => setModal(null)} title={`Delete ${selectedUser?.name}`} footer={<>
                <button onClick={() => setModal(null)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                <button onClick={handleDeleteUser} disabled={isSubmitting} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg w-36 flex justify-center items-center">
                    {isSubmitting ? <SpinnerIcon/> : 'Confirm Delete'}
                </button>
            </>}>
                <p>Are you sure you want to permanently delete this user? This action cannot be undone.</p>
            </Modal>
        </div>
    );
};

export default UserManagement;