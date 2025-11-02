import React, { useState, useEffect, useMemo } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { User, UserRole } from '../../types';
import { useTable } from '../../hooks/useTable';
import PaginationControls from '../../components/shared/PaginationControls';
import { Table, ColumnDefinition } from '../../components/shared/Table';
import Modal from '../../components/shared/Modal';
import { Formik, Form, Field } from 'formik';

const getRolePill = (role: UserRole) => {
    switch (role) {
        case UserRole.PATIENT: return 'bg-blue-100 text-blue-800';
        case UserRole.PROVIDER: return 'bg-emerald-100 text-emerald-800';
        case UserRole.ADMIN: return 'bg-purple-100 text-purple-800';
    }
};

const EditUserModal: React.FC<{ user: User | null; onClose: () => void; }> = ({ user, onClose }) => {
    const { updateUser } = useAuth();

    if (!user) return null;

    return (
        <Modal isOpen={!!user} onClose={onClose} title={`Edit User: ${user.name}`}>
            <Formik
                initialValues={{ name: user.name, role: user.role, status: user.status || 'Active' }}
                onSubmit={(values) => {
                    updateUser({ id: user.id, ...values });
                    onClose();
                }}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Name</label>
                            <Field name="name" className="w-full p-2 border rounded" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Role</label>
                            <Field as="select" name="role" className="w-full p-2 border rounded">
                                {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                            </Field>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Status</label>
                            <Field as="select" name="status" className="w-full p-2 border rounded">
                                <option value="Active">Active</option>
                                <option value="Suspended">Suspended</option>
                                <option value="Inactive">Inactive</option>
                            </Field>
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                            <button type="button" onClick={onClose} className="bg-gray-200 py-2 px-4 rounded-lg">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white py-2 px-4 rounded-lg">Save Changes</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

const UserManagement: React.FC = () => {
    const { users } = useAuth();
    const [roleFilter, setRoleFilter] = useState<UserRole | 'All'>('All');
    const [editingUser, setEditingUser] = useState<User | null>(null);

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
        { accessorKey: 'actions', header: 'Actions', cell: (row) => (
            <button onClick={() => setEditingUser(row)} className="text-primary-600 hover:underline">Edit</button>
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
            <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} />
        </div>
    );
};

export default UserManagement;
