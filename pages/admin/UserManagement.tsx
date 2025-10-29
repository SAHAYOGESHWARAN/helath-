import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, UserRole } from '../../types';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { useTable } from '../../hooks/useTable';
import PaginationControls from '../../components/shared/PaginationControls';
import { SearchIcon } from '../../components/shared/Icons';
import { useApp } from '../../App';

const getRolePill = (role: UserRole) => {
    switch (role) {
        case UserRole.ADMIN: return 'bg-indigo-100 text-indigo-800';
        case UserRole.PROVIDER: return 'bg-teal-100 text-teal-800';
        case UserRole.PATIENT: return 'bg-blue-100 text-blue-800';
    }
};

const getStatusPill = (status: 'Active' | 'Suspended' | 'Inactive') => {
    switch (status) {
        case 'Active':
            return 'bg-green-100 text-green-800';
        case 'Suspended':
            return 'bg-red-100 text-red-800';
        case 'Inactive':
            return 'bg-gray-100 text-gray-800';
    }
};

const UserManagement: React.FC = () => {
    const { users, verifyUser, updateUserStatus } = useAuth();
    const { showToast } = useApp();
    
    const { 
        paginatedItems, 
        requestSort, 
        getSortArrow, 
        setGlobalFilter, 
        setColumnFilters,
        paginationProps 
    } = useTable<User>(users, 10);
    
    const handleVerify = (user: User) => {
        verifyUser(user.id);
        showToast(`${user.name} has been verified.`, 'success');
    };

    const handleSuspend = (user: User) => {
        updateUserStatus(user.id, 'Suspended');
        showToast(`${user.name} has been suspended.`, 'success');
    };

    const handleActivate = (user: User) => {
        updateUserStatus(user.id, 'Active');
        showToast(`${user.name} has been activated.`, 'success');
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
                            <option value="Inactive">Inactive</option>
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
                            {paginatedItems.length > 0 ? (
                                paginatedItems.map(user => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRolePill(user.role)}`}>{user.role}</span></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusPill(user.status || 'Active')}`}>{user.status}</span></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{user.isVerified ? 'Yes' : 'No'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                            {!user.isVerified && user.role === UserRole.PROVIDER && <button onClick={() => handleVerify(user)} className="text-green-600 hover:underline">Verify</button>}
                                            {user.status === 'Active' && <button onClick={() => handleSuspend(user)} className="text-red-600 hover:underline">Suspend</button>}
                                            {user.status === 'Suspended' && <button onClick={() => handleActivate(user)} className="text-blue-600 hover:underline">Activate</button>}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-gray-500">
                                        <p>No users found matching your criteria.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <PaginationControls {...paginationProps} />
            </Card>
        </div>
    );
};

export default UserManagement;