import React, { useMemo, useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { User, UserRole } from '../../types';
import { useTable } from '../../hooks/useTable';
import PaginationControls from '../../components/shared/PaginationControls';

const getRolePill = (role: UserRole) => {
    switch (role) {
        case UserRole.PATIENT: return 'bg-blue-100 text-blue-800';
        case UserRole.PROVIDER: return 'bg-emerald-100 text-emerald-800';
        case UserRole.ADMIN: return 'bg-purple-100 text-purple-800';
    }
}

const UserManagement: React.FC = () => {
    const { users } = useAuth();
    const [roleFilter, setRoleFilter] = useState<UserRole | 'All'>('All');

    const filteredUsers = useMemo(() => {
        if (roleFilter === 'All') return users;
        return users.filter(u => u.role === roleFilter);
    }, [users, roleFilter]);
    
    const { paginatedItems, paginationProps, requestSort, getSortArrow } = useTable(filteredUsers, 10);

    return (
        <div>
            <PageHeader title="User Management" subtitle="View and manage all users on the platform." />
            <Card>
                <div className="flex items-center justify-between mb-4">
                     <div className="flex space-x-2">
                        <button onClick={() => setRoleFilter('All')} className={`px-3 py-1 text-sm rounded-md ${roleFilter === 'All' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>All Roles</button>
                        <button onClick={() => setRoleFilter(UserRole.PATIENT)} className={`px-3 py-1 text-sm rounded-md ${roleFilter === UserRole.PATIENT ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>Patients</button>
                        <button onClick={() => setRoleFilter(UserRole.PROVIDER)} className={`px-3 py-1 text-sm rounded-md ${roleFilter === UserRole.PROVIDER ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>Providers</button>
                        <button onClick={() => setRoleFilter(UserRole.ADMIN)} className={`px-3 py-1 text-sm rounded-md ${roleFilter === UserRole.ADMIN ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>Admins</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th onClick={() => requestSort('name')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Name {getSortArrow('name')}</th>
                                <th onClick={() => requestSort('email')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Email {getSortArrow('email')}</th>
                                <th onClick={() => requestSort('role')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Role {getSortArrow('role')}</th>
                                <th onClick={() => requestSort('status')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Status {getSortArrow('status')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedItems.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRolePill(user.role)}`}>{user.role}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.status}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium"><a href="#" className="text-primary-600 hover:text-primary-900">Edit</a></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 <PaginationControls {...paginationProps} />
            </Card>
        </div>
    );
};

export default UserManagement;
