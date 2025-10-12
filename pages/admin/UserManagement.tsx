import React, { useState, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, UserRole } from '../../types';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import Modal from '../../components/shared/Modal';
import { useApp } from '../../App';
import { SearchIcon, SpinnerIcon } from '../../components/shared/Icons';

const UserForm: React.FC<{ user: Partial<User> | null; onSave: (user: Partial<User>) => void; onCancel: () => void; isSubmitting: boolean; }> = ({ user, onSave, onCancel, isSubmitting }) => {
    const [formData, setFormData] = useState({ id: user?.id, name: user?.name || '', email: user?.email || '', role: user?.role || UserRole.PATIENT });
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(formData); };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" value={formData.name} onChange={e => setFormData(f => ({...f, name: e.target.value}))} className="w-full p-2 border rounded" placeholder="Full Name" required />
            <input type="email" name="email" value={formData.email} onChange={e => setFormData(f => ({...f, email: e.target.value}))} className="w-full p-2 border rounded" placeholder="Email" required />
            <select name="role" value={formData.role} onChange={e => setFormData(f => ({...f, role: e.target.value as UserRole}))} className="w-full p-2 border rounded bg-white">
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
    const { users, addUser, editUser, deleteUser } = useAuth();
    const { showToast } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [modal, setModal] = useState<'edit' | 'delete' | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredUsers = useMemo(() => users.filter(u => 
        (roleFilter === 'All' || u.role === roleFilter) &&
        (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [users, roleFilter, searchTerm]);

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

    const openModal = (type: 'edit' | 'delete', user: User | null = null) => {
        setSelectedUser(user);
        setModal(type);
    };

    return (
        <div>
            <PageHeader title="User Management" buttonText="Add New User" onButtonClick={() => openModal('edit')} />
            <Card>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                    <div className="relative w-full md:max-w-xs"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="h-5 w-5 text-gray-400" /></div><input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"/></div>
                    <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="w-full md:w-auto p-2 border-gray-300 rounded-md bg-white">
                        <option value="All">All Roles</option>
                        {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map(user => (<tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{user.name}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{user.status}</span></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4"><button onClick={() => openModal('edit', user)} className="text-primary-600 hover:underline">Edit</button><button onClick={() => openModal('delete', user)} className="text-red-600 hover:underline">Delete</button></td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            
            <Modal isOpen={modal === 'edit'} onClose={() => setModal(null)} title={selectedUser ? 'Edit User' : 'Add New User'}>
                <UserForm user={selectedUser} onSave={handleSaveUser} onCancel={() => setModal(null)} isSubmitting={isSubmitting} />
            </Modal>
            <Modal isOpen={modal === 'delete'} onClose={() => setModal(null)} title="Confirm Deletion"
                footer={<><button onClick={() => setModal(null)} className="bg-gray-200 font-bold py-2 px-4 rounded-lg">Cancel</button><button onClick={handleDeleteUser} disabled={isSubmitting} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg w-36 flex items-center justify-center">{isSubmitting ? <SpinnerIcon/> : 'Confirm Delete'}</button></>}>
                <p>Are you sure you want to delete <strong>{selectedUser?.name}</strong>? This action cannot be undone.</p>
            </Modal>
        </div>
    );
};

export default UserManagement;
