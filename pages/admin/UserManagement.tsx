
import React, { useState, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, UserRole } from '../../types';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import Modal from '../../components/shared/Modal';
import ToggleSwitch from '../../components/shared/ToggleSwitch';
import { useApp } from '../../App';

// A form component for adding/editing a user inside the modal
const UserForm: React.FC<{ user: Partial<User> | null; onSave: (user: Partial<User>) => void; onCancel: () => void; }> = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        id: user?.id || undefined,
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || UserRole.PATIENT,
        status: user?.status || 'Active',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, status: e.target.checked ? 'Active' : 'Suspended' }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white">
                    {Object.values(UserRole).map(role => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
            </div>
             <div className="flex items-center justify-between p-3 rounded-md bg-gray-50">
                <p className="font-medium text-gray-700">Account Status</p>
                <div className="flex items-center space-x-2">
                    <span className={`text-sm ${formData.status === 'Active' ? 'text-gray-500' : 'font-semibold text-gray-800'}`}>Suspended</span>
                    <ToggleSwitch name="status" checked={formData.status === 'Active'} onChange={handleToggleChange} />
                    <span className={`text-sm ${formData.status === 'Active' ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>Active</span>
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                <button type="submit" className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">{user?.id ? 'Save Changes' : 'Add User'}</button>
            </div>
        </form>
    );
};

// Main component
const UserManagement: React.FC = () => {
    const { users, addUser, editUser, deleteUser } = useAuth();
    const { showToast } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);

    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const matchesRole = roleFilter === 'All' || u.role === roleFilter;
            const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  u.email.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesRole && matchesSearch;
        });
    }, [users, roleFilter, searchTerm]);

    const handleAddUser = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleSaveUser = (userData: Partial<User>) => {
        if (userData.id) {
            editUser(userData as User);
            showToast('User updated successfully!', 'success');
        } else {
            // The id is added in the addUser function in AuthContext
            addUser(userData as Omit<User, 'id'>);
            showToast('User added successfully!', 'success');
        }
        setIsModalOpen(false);
    };

    const getStatusPill = (status?: string) => {
        switch (status) {
            case 'Active': return 'bg-emerald-100 text-emerald-800';
            case 'Suspended': return 'bg-amber-100 text-amber-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            <PageHeader title="User Management" buttonText="Add New User" onButtonClick={handleAddUser} />
            <Card>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full md:max-w-xs px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
                        {(['All', ...Object.values(UserRole)] as const).map(role => (
                            <button
                                key={role}
                                onClick={() => setRoleFilter(role)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${roleFilter === role ? 'bg-white text-primary-600 shadow-sm' : 'bg-transparent text-gray-600 hover:bg-white/50'}`}
                            >
                                {role}s
                            </button>
                        ))}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusPill(user.status)}`}>
                                            {user.status || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                        <button onClick={() => handleEditUser(user)} className="text-primary-600 hover:underline">Edit</button>
                                        <button onClick={() => { if(window.confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) { deleteUser(user.id); showToast('User deleted.', 'success'); } }} className="text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingUser ? 'Edit User' : 'Add New User'}
            >
                <UserForm
                    user={editingUser}
                    onSave={handleSaveUser}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default UserManagement;
