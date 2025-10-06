import React from 'react';
import Card from '../../components/shared/Card';
import { User, UserRole } from '../../types';

const mockUsers: User[] = [
    { id: 'pat1', name: 'John Doe', email: 'john.doe@email.com', role: UserRole.PATIENT },
    { id: 'pro1', name: 'Dr. Jane Smith', email: 'jane.smith@email.com', role: UserRole.PROVIDER },
    { id: 'adm1', name: 'Alex Johnson', email: 'alex.j@email.com', role: UserRole.ADMIN },
];

const UserManagement: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>
      <Card>
        <p>Manage all users in the system, including patients, providers, and other administrators.</p>
        <div className="overflow-x-auto mt-4">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {mockUsers.map(user => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
};

export default UserManagement;
