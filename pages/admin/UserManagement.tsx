import React, { useState, useMemo, useEffect } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { User, UserRole } from '../../types';
import { useTable } from '../../hooks/useTable';
import PaginationControls from '../../components/shared/PaginationControls';
import { Table, ColumnDefinition } from '../../components/shared/Table';

const getRolePill = (role: UserRole) => {
    switch (role) {
        case UserRole.PATIENT: return 'bg-blue-100 text-blue-800';
        case UserRole.PROVIDER: return 'bg-emerald-100 text-emerald-800';
        case UserRole.ADMIN: return 'bg-purple-100 text-purple-800';
    }
};

const UserManagement: React.FC = () => {
    const { users } = useAuth();
    const [roleFilter, setRoleFilter] = useState<UserRole | 'All'>('All');

    const { 
        paginatedItems, 
        paginationProps, 
        requestSort, 
        getSortArrow,
        setColumnFilters,
    } = useTable(users, 10);
    
    useEffect(() => {
        setColumnFilters(prev => ({...prev, role: roleFilter === 'All' ? '' : roleFilter}));
    }, [roleFilter, setColumnFilters]);

    const columns: ColumnDefinition<User>[] = [
        { accessorKey: 'name', header: 'Name', cell: row => <span className="font-medium text-gray-900">{row.name}</span> },
        { accessorKey: 'email', header: 'Email' },
        { accessorKey: 'role', header: 'Role', cell: row => (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRolePill(row.role)}`}>{row.role}</span>
        )},
        { accessorKey: 'status', header: 'Status', cell: row => row.status },
        { accessorKey: 'actions', header: 'Actions', cell: () => (
            <button className="text-primary-600 hover:underline">Edit</button>
        )},
    ];

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
                <Table<User>
                    columns={columns}
                    data={paginatedItems}
                    requestSort={requestSort}
                    getSortArrow={getSortArrow}
                />
                 <PaginationControls {...paginationProps} />
            </Card>
        </div>
    );
};

export default UserManagement;
