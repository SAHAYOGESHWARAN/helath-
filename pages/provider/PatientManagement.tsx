import React from 'react';
import Card from '../../components/shared/Card';
import { Patient, UserRole } from '../../types';

const mockPatients: Patient[] = [
    { id: 'p1', name: 'John Doe', dob: '1985-05-20', lastSeen: '2024-08-01', status: 'Active' },
    { id: 'p2', name: 'Alice Johnson', dob: '1992-11-12', lastSeen: '2024-07-15', status: 'Active' },
    { id: 'p3', name: 'Bob Williams', dob: '1970-02-01', lastSeen: '2023-12-10', status: 'Inactive' },
]

const PatientManagement: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Patient Management</h1>
      <Card>
        <input type="text" placeholder="Search patients..." className="w-full max-w-sm mb-4 px-3 py-2 border border-gray-300 rounded-md"/>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date of Birth</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Seen</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {mockPatients.map(p => (
                        <tr key={p.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.dob}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.lastSeen}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
};

export default PatientManagement;
