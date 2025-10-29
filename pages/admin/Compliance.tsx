import React from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';

const Compliance: React.FC = () => {
    // Mock audit log data
    const auditLog = [
        { id: 1, timestamp: '2024-08-15 10:32:15', user: 'Dr. Jane Smith', userRole: 'Provider', action: 'Access EMR', details: 'Viewed chart for John Doe (pat1)' },
        { id: 2, timestamp: '2024-08-15 09:45:22', user: 'Alex Johnson', userRole: 'Admin', action: 'Update Settings', details: 'Updated system feature flags' },
        { id: 3, timestamp: '2024-08-15 09:10:48', user: 'John Doe', userRole: 'Patient', action: 'Login Success', details: 'User logged in from IP 203.0.113.25' },
        { id: 4, timestamp: '2024-08-14 15:20:11', user: 'Dr. Jane Smith', userRole: 'Provider', action: 'E-Prescription Sent', details: 'Sent prescription for Amoxicillin to patient Alice Johnson' },
    ];
    
    return (
        <div>
            <PageHeader title="Compliance & Auditing" subtitle="Monitor system access and data protection." />
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">System Audit Log</h3>
                    <div className="flex space-x-2">
                        <input type="text" placeholder="Filter by user or action..." className="p-2 border rounded-md text-sm" />
                        <button className="bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg text-sm">Export Log</button>
                    </div>
                </div>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                             {auditLog.length > 0 ? (
                                auditLog.map(log => (
                                     <tr key={log.id}>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{log.timestamp}</td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.user}</td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.userRole}</td>
                                         <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{log.action}</span></td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.details}</td>
                                     </tr>
                                 ))
                             ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-500">
                                        No audit log entries found.
                                    </td>
                                </tr>
                             )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Compliance;