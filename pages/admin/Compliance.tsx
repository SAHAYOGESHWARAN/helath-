
import React, { useMemo, useState, useCallback } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';

const exportToCsv = (filename: string, rows: object[]) => {
    if (!rows || rows.length === 0) {
        return;
    }
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
        keys.join(separator) +
        '\n' +
        rows.map(row => {
            return keys.map(k => {
                let cell = (row as any)[k] === null || (row as any)[k] === undefined ? '' : (row as any)[k];
                cell = String(cell).replace(/"/g, '""');
                if (String(cell).includes(separator) || String(cell).includes('\n')) {
                    cell = `"${cell}"`;
                }
                return cell;
            }).join(separator);
        }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const Compliance: React.FC = () => {
    const { auditLog } = useAuth();
    const [filter, setFilter] = useState('');

    const filteredLog = useMemo(() => {
        if (!filter) return auditLog;
        const lowercasedFilter = filter.toLowerCase();
        return auditLog.filter(log => 
            log.user.toLowerCase().includes(lowercasedFilter) ||
            log.action.toLowerCase().includes(lowercasedFilter) ||
            log.details.toLowerCase().includes(lowercasedFilter)
        );
    }, [auditLog, filter]);

    const handleExport = useCallback(() => {
        exportToCsv('compliance_audit_log.csv', filteredLog);
    }, [filteredLog]);
    
    return (
        <div>
            <PageHeader title="Compliance & Auditing" subtitle="Monitor system access and data protection." />
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">System Audit Log</h3>
                    <div className="flex space-x-2">
                        <input 
                            type="text" 
                            placeholder="Filter by user or action..." 
                            className="p-2 border rounded-md text-sm" 
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                        <button onClick={handleExport} className="bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg text-sm">Export Log</button>
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
                             {filteredLog.length > 0 ? (
                                filteredLog.map(log => (
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